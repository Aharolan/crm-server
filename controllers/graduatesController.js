const { get } = require("../baseServer");
const express = require("express");
const router = express.Router();
const db = require("../dataBase");
const milestones = require ("./milestonesInfoController")



const getGraduates = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
    (SELECT en.name
      FROM events e
      JOIN event_names en ON e.event_name_id = en.event_name_id
      WHERE e.student_id = s.student_id
      ORDER BY e.date DESC LIMIT 1) as status,
    c.name as class_name,
    s.email,
    s.phone_number,
    s.last_name,
    s.first_name,
    s.student_id as id
FROM 
    students s
JOIN
    classes c ON s.class_id = c.class_id
WHERE
    s.student_status_id = 2
ORDER BY s.last_name`;
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
  const responseArray = await getGraduates();
  try {
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCustomerGraduates = (customer_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT
    (SELECT en.name
      FROM events e
      JOIN event_names en ON e.event_name_id = en.event_name_id
      WHERE e.student_id = s.student_id
      ORDER BY e.date DESC LIMIT 1) as status,
    c.name as class_name,
    s.email,
    s.phone_number,
    s.last_name,
    s.first_name,
    s.student_id as id
FROM 
    students s
JOIN
    classes c ON s.class_id = c.class_id
JOIN events e ON e.customer_id = ?
WHERE
    s.student_status_id = 2 
    and 
    s.student_id = e.student_id

ORDER BY s.last_name`;
    db.query(query, [customer_id], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getRow = async (req, res) => {
  try {
    const responseArray = await getCustomerGraduates(req.params.id);
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);
router.get("/read/:id", getRow)

router.use('/milestones', milestones)

module.exports = router;
