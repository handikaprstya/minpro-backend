module.exports = {
  development: {
    username: "root",
    password: process.env.PASSWORD_DATABASE,
    database: process.env.NAME_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  prodction: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql"
  }}