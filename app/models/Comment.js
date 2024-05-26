const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Comment;
