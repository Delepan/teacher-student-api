const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Teacher = sequelize.define('Teacher',{
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
});

module.exports = Teacher;