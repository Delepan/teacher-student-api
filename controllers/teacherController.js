const Teacher = require("../models/teacher");
const Student = require("../models/student");

exports.registerStudents = async (req, res) => {
  try {
    const { teacher, students } = req.body;
    if (!teacher || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json("Teacher or Student details are required!");
    }

    let teacherStatus = "existed";
    let studentNewlyCreated = [];
    let studentExisted = [];

    const [teacherValue, teacherCreated] = await Teacher.findOrCreate({
      where: { email: teacher },
    });
    if (teacherCreated) teacherStatus = "created";
    const studentList = [];
    for (const email of students) {
      const [studentValue, studentCreated] = await Student.findOrCreate({
        where: { email: email },
      });
      studentList.push(studentValue);

      if (studentCreated) {
        studentNewlyCreated.push(email);
      } else {
        studentExisted.push(email);
      }
    }
    await teacherValue.addStudents(studentList);
    return res.status(204);
    // res.status(200).json({
    //   teacher: {
    //     email: teacher,
    //     status: teacherStatus,
    //   },
    //   students: {
    //     added: studentNewlyCreated,
    //     alreadyExist: studentExisted,
    //   },
    // });
  } catch (error) {
    console.error("Error in registration", error);
    res.status(500).json({ error: "Internel server error" });
  }
};

exports.getCommonStudents = async (req, res) => {
  try {
    let { teacher } = req.query;
    if (!teacher) {
      return res
        .status(400)
        .json({ error: "At least one teacher is required!" });
    }

    if (!Array.isArray(teacher)) {
      teacher = [teacher];
    }

    const teacherList = await Teacher.findAll({ where: { email: teacher } });

    if (teacherList.length !== teacher.length) {
      return res.status(404).json({ error: "teacher not found!" });
    }

    const studentList = await Promise.all(
      teacherList.map((t) => t.getStudents({ where: { is_suspended: false } }))
    );

    const studentEmails = studentList.map((list) =>
      list.map((student) => student.email)
    );

    let commonStudentList = studentEmails[0] || [];
    for (let i = 1; i < studentEmails.length; i++) {
      commonStudentList = commonStudentList.filter((email) =>
        studentEmails[i].includes(email)
      );
    }

    if (commonStudentList.length === 0) {
      return res
        .status(200)
        .json({ students: [], message: "There is no common students!" });
    }

    return res.status(200).json({ students: commonStudentList });
  } catch (error) {
    console.error("Error in getCommonStudents", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
