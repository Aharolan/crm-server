const mysql = require("mysql");
require("dotenv").config({ path: ".env.local" });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: 'utf8mb4'
});

db.connect((err) => {
  if (err) {
    console.log(`Error connecting to MySQL: \n${err.message}`);
    return;
  }
  console.log("Database connected ✅");
});

module.exports = db;
