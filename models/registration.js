const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Registration",
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
