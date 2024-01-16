const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const { getColumn, add, updateData, getRows } = require("../baseServer");

const getColumnInfo = async (req, res) => {
  const column = await getColumn("customers", req.params.columnName);
  try {
    res.status(200).send(column);
  } catch (error) {
    res.status(500).send(error);
  }
};

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
    console.log(resArray)
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addInterviewDay = async (interviewDayObject, response) => {
  try {
    const interview_id = await add("interviews", interviewDayObject);
    console.log({ message: `interview day added with interview_id: ${interview_id}` });
    return interview_id
  } catch (error) {
    response.status(500).send(error);
  }
};

const addTechnology = async (technology_id, customer_id, response) => {
  try {
    technology_id.map( technology => {
      add("customers_technologies", {customer_id: customer_id, technology_id: technology})
    });
    console.log({ message: "tech added " });
  } catch (error) {
    response.status(500).send(error);
  }
};

const addGraduatesInterviews = async (students_id, interview_id, response) => {
  try {
    students_id.map( student => {
      add("graduates_interviews", {student_id: student, interview_id: interview_id})
    });
    console.log({ message: "graduates_interviews added " });
  } catch (error) {
    response.status(500).send(error);
  }
};

const addInterview = async (request, response) => {
  try {
    const { technology_id, students_id, ...interviewDayObject } = request.body;
    const {customer_id} = request.body;
    const interview_id = await addInterviewDay(interviewDayObject, response);
    await addTechnology(technology_id, customer_id, response);
    await addGraduatesInterviews(students_id, interview_id, response)
    response.send({ message: "data added " })
  } catch (error) {
    response.status(500).send(error);
  }
};

router.get("/", getAll);
router.get("/read/:id", getByCompany);
router.get("/column/:columnName", getColumnInfo);
router.post("/create", addInterview);
module.exports = router;