// data base:

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "database-1.cxi4w80ccf7t.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "R7biAT^7Gt%5G!i",
  database: "crm_db",
});

const connection = db.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("DataBase connected");
});

module.exports = db;
