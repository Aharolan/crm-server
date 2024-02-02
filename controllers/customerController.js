const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const updateData1 = (collection, oq, newData, idColumn, idValue) => {
  db.query(oq, [idValue], (err, results) => {
    if (err) {
      console.error("Error fetching current data:", err);
      return;
    }

    if (results.length === 0) {
      console.error(`No data found for ${idColumn} ${idValue}`);
      return;
    }

    const currentData = results[0];
    const changedFields = {};
    for (const key in newData) {
      if (newData[key] !== currentData[key]) {
        changedFields[key] = newData[key];
      }
    }

    if (Object.keys(changedFields).length === 0) {
      console.log(`No changes detected for ${idColumn} ${idValue}`);
      return;
    }
    const setClause = Object.keys(changedFields)
      .map((key) => `${key} = ?`)
      .join(",");
    const query = `UPDATE ${collection} SET ${setClause} WHERE ${idColumn} = ?`;
    const values = Object.values(changedFields);
    values.push(idValue);

    db.query(query, values, (Err, Results) => {
      if (Err) {
        console.error("Error updating data:", Err);
      } else {
      }
    });
  });
};

const queryAll = `
SELECT 
contact_name,
address,
company_name,  
customer_id as id
FROM
customers
ORDER BY 
company_name`;

const queryRow = `SELECT 
    c.contact_email,
    c.contact_phone,
    c.contact_name,
    c.customer_id,
    (SELECT
        GROUP_CONCAT(t.name SEPARATOR ', ') as technologies
        FROM
        technologies t,
        customers c,
        customers_technologies as ct
        WHERE 
        t.technology_id = ct.technology_id
        and c.customer_id = ct.customer_id
        and c.customer_id = 3
    ) AS technologies,
    c.address,
    c.company_name,
    c.notes
FROM
    customers c,
    technologies t
WHERE
    c.customer_id = ?
LIMIT 1;
`;

const queryCompanyName = `SELECT company_name FROM customers;`;

const getCustomers = () => {
  return new Promise((resolve, reject) => {
    db.query(queryAll, [], (err, rows) => {
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

const getCompanyName = () => {
  return new Promise((resolve, reject) => {
    db.query(queryCompanyName, [], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getAllCustomers = async (req, res) => {
  try {
    const responseArray = await getCompanyName();
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCustomerRow = (customer_id) => {
  return new Promise((resolve, reject) => {
    db.query(queryRow, [customer_id], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};

const getRow = async (req, res) => {
  try {
    const responseArray = await getCustomerRow(req.params.id);
    console.log(responseArray);
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const putCustomers = async (req, res) => {
  await updateData1(
    "customers",
    queryRow,
    req.body,
    "customer_id",
    req.params.id
  );
  res.send({
    message: `Data for customer_id ${req.params.id} updated successfully`,
  });
};

router.get("/", getAll);
router.get("/read/:id", getRow);
router.put("/update/:id", putCustomers);
router.get("/column/:company_name", getAllCustomers);

module.exports = router;
