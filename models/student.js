const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Student",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      is_suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );
