const express = require("express");
const router = express.Router();
const db = require("../dataBase");
const path = require("path");
const fs = require("fs");

const parent_dir = path.resolve(__dirname, "..");
const FILES_DIR = path.join(parent_dir, "files");

const getStudentDetails = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS name,
        c.name AS stuClass,
        TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) AS age,
        mt.name AS martial_status,
        sum_of_childrens AS children,
        s.city,
        s.phone_number,
        s.email,
        ROUND(AVG(g.num_grade), 1) AS avg_grade,
        ci.image_path,
        s.candidates_candidate_id  -- Include candidates_candidate_id in the SELECT statement
      FROM 
        students s
      JOIN 
        marital_status mt ON s.marital_status_id = mt.marital_status_id
      JOIN 
        classes c ON c.class_id = s.class_id
      LEFT JOIN 
        grades g ON g.student_id = s.student_id
      LEFT JOIN 
        candidate_info ci ON s.candidates_candidate_id = ci.id_candidate
      WHERE 
        s.student_id = ?
      GROUP BY 
        s.student_id;
    `;

    db.query(query, [id], (err, row) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(row[0]);
      }
    });
  });
};

const getStudent = async (req, res) => {
  try {
    let studentDetails = await getStudentDetails(req.params.id);

    if (studentDetails && studentDetails.candidates_candidate_id) {
      filePath = path.join(
        `${FILES_DIR}/${studentDetails.candidates_candidate_id}/${studentDetails.candidates_candidate_id}.txt`
      );

      try {
        studentDetails.image_path = fs.readFileSync(filePath, "utf8");
      } catch (error) {
        console.log(error);
      }
    }

    res.status(200).send(studentDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/read/:id", getStudent);

module.exports = router;
