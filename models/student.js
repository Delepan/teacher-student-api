const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Student = sequelize.define('Student',{
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    is_suspended:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
});

module.exports = Student;