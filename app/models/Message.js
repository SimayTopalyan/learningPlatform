// models/Message.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reciverid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Message;
