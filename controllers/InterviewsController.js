const express = require("express");
const router = express.Router();
const db = require("../dataBase");
const { add, delete_, updateData } = require("../baseServer");

const getInterviews = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT i.position, DATE_FORMAT(i.date, '%d/%m/%y') AS date, c.company_name as companyName, i.interview_id as id
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
  `SELECT i.position, DATE_FORMAT(i.date, '%d/%m/%y') AS date, c.company_name as companyName, i.interview_id as id
  FROM customers c, interviews i
  WHERE c.customer_id = i.customer_id and c.customer_id = ?
  ORDER BY date`;
    db.query(query, [id], (err, rows) => {
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

const deleteOperation = async (tableName, ID, columnName) => {
  try {
    delete_(tableName, ID, columnName);
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
};

const updateOperation = async (tableName, updatedData, ID, IDValue) => {
  try {
    updateData(tableName, updatedData, ID, IDValue);
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
};

const addOperation = async (tableName, data) => {
  try {
    const ID = await add(tableName, data);
    return ID;
  } catch (error) {
    console.error(`Error adding to ${tableName}:`, error);
    throw error;
  }
};

const editInterview = async (request, response) => {
  try {
    const interviewID = request.params.id;
    const { updateInterview, students_id, technology_id, newTechnologiesNames } = request.body;

    await deleteOperation("graduates_interviews", interviewID, "interview_id");
    await deleteOperation("interviews_technologies", interviewID, "interview_id");

    await updateOperation("interviews", updateInterview, "interview_id", interviewID);

    await Promise.all(students_id.map(student => addOperation("graduates_interviews", { student_id: student, interview_id: interviewID })));
    await Promise.all(technology_id.map(tech => addOperation("interviews_technologies", { technology_id: tech, interview_id: interviewID })));

    for (let technology of newTechnologiesNames) {
      const newTechID = await addOperation("technologies", { name: technology });
      await addOperation("interviews_technologies", { technology_id: newTechID, interview_id: interviewID });
    }

    response.status(200).send({ message: "interview updated" });
  } catch (error) {
    response.status(500).send(error);
  }
};

const infoToEditInterview = (id) => {
  return new Promise((resolve, reject) => {
    const candidatesInfoQuery = `
      SELECT
      CONCAT(s.last_name, ' ', s.first_name) AS name,
        s.student_id as id,
        right(c.name, 1) as classNumber,
        CASE WHEN gi.student_id IS NOT NULL THEN TRUE ELSE FALSE END as isSelected
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN graduates_interviews gi ON s.student_id = gi.student_id AND gi.interview_id = ?
      WHERE s.student_status_id = 2
      ORDER BY isSelected DESC
    `;
    db.query(candidatesInfoQuery, [id], (err1, candidates) => {
      if (err1) {
        console.error("Error fetching data from candidatesInfoQuery:", err1);
        reject(err1);
      } else {
        const technologiesInfoQuery = `
          SELECT 
            t.technology_id as id,
            t.name,
            CASE WHEN it.technology_id IS NOT NULL THEN TRUE ELSE FALSE END as isSelected
          FROM technologies t
          LEFT JOIN interviews_technologies it ON t.technology_id = it.technology_id AND it.interview_id = ?
        `;

        db.query(technologiesInfoQuery, [id], (err2, technologies) => {
          if (err2) {
            console.error("Error fetching data from technologiesInfoQuery:", err2);
            reject(err2);
          } else {
            resolve({ candidates: candidates, technologies: technologies }); // Combine results as needed
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

const getCustomers = () => {
  return new Promise((resolve, reject) => {
    const customersQuery = `
      SELECT 
        customer_id as id,
        company_name as name,
        false as isSelected
      FROM crm_db.customers`;
    db.query(customersQuery, [], (err, rows) => {
      if (err) {
        console.error("Error fetching customers data:", err);
        reject(err);
      } else {
        resolve(rows);}});
  });
};

const getTechnologies = () => {
  return new Promise((resolve, reject) => {
    const technologiesQuery = `
    SELECT 
      technology_id as id,
      name,
      false as isSelected
      FROM crm_db.technologies`;
    db.query(technologiesQuery, [], (err, rows) => {
      if (err) {
        console.error("Error fetching technologies data:", err);
        reject(err);
      } else {
        resolve(rows);}});
  });
};

const getCandidates = () => {
  return new Promise((resolve, reject) => {
    const candidatesQuery = `
      SELECT
        s.student_id as id, 
        CONCAT(s.last_name,' ', s.first_name) AS name,
        c.name as classNumber,
        FALSE as isSelected
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      WHERE s.student_status_id = 2
      ORDER BY s.last_name`;
    db.query(candidatesQuery, [], (err, rows) => {
      if (err) {
        console.error("Error fetching candidates data:", err);
        reject(err);
      } else {
        resolve(rows);}});
  });
};

const getCustomersTechnologies = () => {
  return new Promise((resolve, reject) => {
    const customersTechnologiesQuery = `
      SELECT * FROM crm_db.customers_technologies`;
    db.query(customersTechnologiesQuery, [], (err, rows) => {
      if (err) {
        console.error("Error fetching customersTechnologies data:", err);
        reject(err);
      } else {
        resolve(rows);}});
  });
};

const newInterview = async (req, res) => {
  const customers = await getCustomers();
  const technologies = await getTechnologies();
  const candidates = await getCandidates();
  const customersTechnologies = await getCustomersTechnologies();
  try {
    res.status(200).send({customers: customers, technologies: technologies, candidates: candidates, customersTechnologies: customersTechnologies});
    } catch (error) {
    res.status(500).send(error);
  }
};

const createInterview = async (req, res) => {
  try {
    const {candidatesIDs, customerID, date, newTechnologiesNames, position, technologiesIDs} = req.body
    const interviewID = await add("interviews", {customer_id: customerID, date: date, position: position})
    await Promise.all(candidatesIDs.map(student => addOperation("graduates_interviews", { student_id: student, interview_id: interviewID })));
    await Promise.all(technologiesIDs.map(tech => addOperation("interviews_technologies", { technology_id: tech, interview_id: interviewID })));

    for (let technology of newTechnologiesNames) {
      const newTechID = await addOperation("technologies", { name: technology });
      await addOperation("interviews_technologies", { technology_id: newTechID, interview_id: interviewID });
    }
    res.status(201).send(`new interview with id: ${interviewID} inserted succufully`);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.post("/create", createInterview)
router.get("/newInterview", newInterview);
router.get("/", getAll);
router.get("/read/:id", getByCompany);
router.put("/update/:id", editInterview);
router.get("/edit_interview/:id", getInterview)
module.exports = router;
