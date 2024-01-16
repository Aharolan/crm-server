const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const getInterviewsCandidates = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
    s.city,
    right(c.name, 1) as class_number,
    s.last_name as last_name,
    s.first_name as first_name,
    s.student_id as id
FROM students s
JOIN
    classes c 
    ON s.class_id = c.class_id
WHERE s.student_status_id = 2
ORDER BY s.first_name`;
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
  const resArray = await getInterviewsCandidates();
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);
module.exports = router;
