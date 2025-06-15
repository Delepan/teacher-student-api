const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Registration = sequelize.define('Registration', {
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },  
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Registration;