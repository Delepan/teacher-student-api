const { Teacher, Student } = require("../models");

// Register students to a teacher
exports.registerStudents = async (req, res) => {
  try {
    const { teacher, students } = req.body;
    if (!teacher || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({ error: "Teacher and students are required." });
    }
    const [teacherValue] = await Teacher.findOrCreate({
      where: { email: teacher },
    });
    const studentList = [];
    for (const email of students) {
      const [studentValue] = await Student.findOrCreate({ where: { email } });
      studentList.push(studentValue);
    }
    await teacherValue.addStudents(studentList);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get common students for one or more teachers
exports.getCommonStudents = async (req, res) => {
  try {
    let { teacher } = req.query;
    if (!teacher) {
      return res
        .status(400)
        .json({ error: "At least one teacher is required." });
    }
    if (!Array.isArray(teacher)) teacher = [teacher];
    const teacherList = await Teacher.findAll({ where: { email: teacher } });
    if (teacherList.length !== teacher.length) {
      return res.status(404).json({ error: "One or more teachers not found." });
    }
    const studentLists = await Promise.all(
      teacherList.map((t) => t.getStudents({ where: { is_suspended: false } }))
    );
    const studentEmails = studentLists.map((list) => list.map((s) => s.email));
    let commonStudents = studentEmails[0] || [];
    for (let i = 1; i < studentEmails.length; i++) {
      commonStudents = commonStudents.filter((email) =>
        studentEmails[i].includes(email)
      );
    }
    return res.status(200).json({ students: commonStudents });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Suspend a student
exports.toSuspend = async (req, res) => {
  try {
    const { student } = req.body;
    const studentDetail = await Student.findOne({ where: { email: student } });
    if (!studentDetail) {
      return res.status(404).json({ error: "Student not found." });
    }
    studentDetail.is_suspended = true;
    await studentDetail.save();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve students eligible for notification
exports.retriveForNotifications = async (req, res) => {
  try {
    const { teacher, notification } = req.body;
    if (!teacher || !notification) {
      return res
        .status(400)
        .json({ error: "Teacher and notification are required." });
    }
    const teacherRecord = await Teacher.findOne({ where: { email: teacher } });

    if (!teacherRecord) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    // Students registered under the teacher (not suspended)
    const registeredStudents = await teacherRecord.getStudents({
      where: { is_suspended: false },
    });
    const registeredEmails = registeredStudents.map((s) => s.email);

    // Students mentioned in the notification (not suspended)
    const mentionedEmails =
      notification
        .match(/@([\w.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g)
        ?.map((n) => n.slice(1)) || [];
    const mentionedStudents = await Student.findAll({
      where: { email: mentionedEmails, is_suspended: false },
    });
    const mentionedValidEmails = mentionedStudents.map((s) => s.email);

    // Combine and deduplicate
    const recipients = Array.from(
      new Set([...registeredEmails, ...mentionedValidEmails])
    );
    return res.status(200).json({ recipients });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
