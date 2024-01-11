const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const getInterviews = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
    i.position,
    DATE_FORMAT(i.date, '%d/%m/%y') AS date,
    c.company_name,
    i.interview_id as id
  FROM 
    customers c,
      interviews i
  WHERE 
    c.customer_id = i.customer_id
  ORDER BY date`;
    db.query(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getAll = async (req, res) => {
  const resArray = await getInterviews();
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);

module.exports = router;