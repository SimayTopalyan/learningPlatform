// models/Connection.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Connection = sequelize.define("Connection", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Connection;
