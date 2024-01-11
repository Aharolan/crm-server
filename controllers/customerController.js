const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const getCustomers = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        contact_name,
        address,
        company_name,  
        customer_id as id   
      FROM
        customers
      ORDER BY 
        company_name`;
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
  const responseArray = await getCustomers();
  try {
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);

module.exports = router;