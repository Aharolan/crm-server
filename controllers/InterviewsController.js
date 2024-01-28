const express = require("express");
const router = express.Router();
const db = require("../dataBase");
const {add, delete_, updateData} = require("../baseServer");

const getInterviews = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT i.position, DATE_FORMAT(i.date, '%d/%m/%y') AS date, c.company_name, i.interview_id as id
  FROM customers c, interviews i
  WHERE  c.customer_id = i.customer_id ORDER BY date`;
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

const getCompanyInterviews = (id) => {
  return new Promise((resolve, reject) => {
    const query = 
  `SELECT i.position, DATE_FORMAT(i.date, '%d/%m/%y') AS date, c.company_name, i.interview_id as id
  FROM customers c, interviews i
  WHERE c.customer_id = i.customer_id and c.customer_id = ?
  ORDER BY date`;
    db.query(query, [id], (err, rows) => {
      console.log(query)
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getByCompany = async (req, res) => {
  const resArray = await getCompanyInterviews(req.params.id);
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editInterview = async (request, response) => {
  try {
    const interviewID = await request.params.id;
    delete_("graduates_interviews", interviewID, "interview_id");
    delete_("interviews_technologies", interviewID, "interview_id");
    updateData( "interviews", request.body.updateInterview, "interview_id", interviewID)
    request.body.students_id.map((students) => {
      add("graduates_interviews", {student_id: students, interview_id: interviewID})});
    request.body.technology_id.map((technology) => {
      add("interviews_technologies", {technology_id: technology, interview_id: interviewID})});
    for (let technology of request.body.newTechnologies) {
      const newTechID = await add("technologies", {name: technology});
      await add("interviews_technologies", {technology_id: newTechID, interview_id: interviewID});
    }
    response.status(200).send({ message: "interview updated" });
  } catch (error) {
    response.status(500).send(error);
  }
};

const infoToEditInterview = (id) => {
  return new Promise((resolve, reject) => {
    const query1 = `
      SELECT
      CONCAT(s.last_name, ' ', s.first_name) AS name,
        s.student_id as id,
        right(c.name, 1) as class_number,
        CASE WHEN gi.student_id IS NOT NULL THEN TRUE ELSE FALSE END as isSelected
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN graduates_interviews gi ON s.student_id = gi.student_id AND gi.interview_id = ${id}
      WHERE s.student_status_id = 2
      ORDER BY s.last_name
    `;
    db.query(query1, [], (err1, candidates) => {
      if (err1) {
        console.error("Error fetching data from query1:", err1);
        reject(err1);
      } else {
        const query2 = `
          SELECT 
            t.technology_id as id,
            t.name,
            CASE WHEN it.technology_id IS NOT NULL THEN TRUE ELSE FALSE END as isSelected
          FROM technologies t
          LEFT JOIN interviews_technologies it ON t.technology_id = it.technology_id AND it.interview_id = ${id}
        `;

        db.query(query2, [], (err2, technologies) => {
          if (err2) {
            console.error("Error fetching data from query2:", err2);
            reject(err2);
          } else {
            resolve({ candidates: candidates, technologies: technologies }); // Combine results if needed
          }
        });
      }
    });
  });
};

const getInterview = async (req, res) => {
  const resArray = await infoToEditInterview(req.params.id);
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};
    
router.get("/", getAll);
router.get("/read/:id", getByCompany);
router.put("/update/:id", editInterview);
router.get("/editInterview/:id", getInterview)
module.exports = router;