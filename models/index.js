const {Sequelize} = require('sequelize');
require('dotenv').config();

console.log('Connecting to DB host:', process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);

sequelize
    .authenticate()
    .then(() => console.log('MySql is connected'))
    .catch((err) => console.log('Unable to connect to MySql',err));

module.exports = sequelize;


const Teacher = require('./teacher');
const Student = require('./student');
const Registration = require('./registration');

Teacher.belongsToMany(Student,{
    through: Registration,
    foreignKey: 'teacher_id'
});
Student.belongsToMany(Teacher, {
    through: Registration,
    foreignKey: 'student_id'
});

sequelize.sync({alter:true})
    .then(()=> console.log("All Model Sync with DB!"))
    .catch((err) => console.log("Have error,",err));