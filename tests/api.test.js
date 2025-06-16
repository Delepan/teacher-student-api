const request = require("supertest");
const app = require("../app");
const { sequelize, Teacher, Student } = require("../models");

beforeEach(async () => {
  // Clean and re-seed before each test!
  await sequelize.sync({ force: true });
  const teacherKen = await Teacher.create({ email: "teacherken@gmail.com" });
  const studentJon = await Student.create({ email: "studentjon@gmail.com" });
  const studentHon = await Student.create({ email: "studenthon@gmail.com" });
  const studentBob = await Student.create({ email: "studentbob@gmail.com" });

  // Only add Jon and Hon to teacherKen for proper coverage
  await teacherKen.addStudents([studentJon, studentHon]);
});

describe("Teacher-Student API (mock DB)", () => {
  it("should register students to a teacher", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
        students: ["studentjon@gmail.com", "studenthon@gmail.com"],
      });
    expect(res.statusCode).toBe(204);
  });

  it("should suspend a student", async () => {
    const res = await request(app)
      .post("/api/suspend")
      .send({ student: "studentjon@gmail.com" });
    expect(res.statusCode).toBe(204);
  });

  it("should get common students", async () => {
    const res = await request(app).get(
      "/api/commonstudents?teacher=teacherken@gmail.com"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.students).toContain("studenthon@gmail.com");
  });
});
