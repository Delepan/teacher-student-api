const { Sequelize } = require("sequelize");
require("dotenv").config();
const isTest = process.env.NODE_ENV === "test";

console.log("Connecting to DB host:", process.env.DB_HOST);

const sequelize = isTest
  ? new Sequelize("sqlite::memory:", { logging: false })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
      }
    );

// Models as functions that accept sequelize instance!
const TeacherModel = require("./teacher");
const StudentModel = require("./student");
const RegistrationModel = require("./registration");

// Create models using *same* sequelize instance
const Teacher = TeacherModel(sequelize);
const Student = StudentModel(sequelize);
const Registration = RegistrationModel(sequelize);

// Associations
Teacher.belongsToMany(Student, {
  through: Registration,
  foreignKey: "teacher_id",
});
Student.belongsToMany(Teacher, {
  through: Registration,
  foreignKey: "student_id",
});

sequelize
  .authenticate()
  .then(() => console.log("MySql is connected"))
  .catch((err) => console.log("Unable to connect to MySql", err));

sequelize
  .sync({ alter: isTest ? false : true }) // No alter for test
  .then(() => console.log("All Model Sync with DB!"))
  .catch((err) => console.log("Have error,", err));

module.exports = { sequelize, Teacher, Student, Registration };
