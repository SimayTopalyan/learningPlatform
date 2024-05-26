// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("u114524246_social", "u114524246_root", "7Ob2an;HK3&", {
  host: "193.203.168.38",
  dialect: "mysql",
  port: "3306",
});

module.exports = sequelize;
