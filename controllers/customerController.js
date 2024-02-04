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
company_name
`;

const queryRow = `
SELECT 
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
  try {
    const responseArray = await getCustomers();
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

const getTechs = () => {
  return new Promise((resolve, reject) => {
    const queryGetAllTechs = `
    SELECT 
        t.technology_id as id,
        name,
        FALSE  as isSelected
    FROM
        technologies t
    ORDER BY 
        name;
    `;
    db.query(queryGetAllTechs, [], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getAllTechs = async (req, res) => {
  try {
    const responseArray = await getTechs();
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const itemsFilter = (items) => {
  const existingItems = [];
  const newItems = [];

  for (const item of items) {
    const { id, name, isSelected } = item;
    if (isSelected) {
      if (id !== null && id !== undefined) {
        existingItems.push(id);
      } else {
        newItems.push({ name });
      }
    }
  }
  const filtererdItems = { existingItems, newItems };
  return filtererdItems;
};

const addNewItems = async (collection, newItems) => {
  const newItemIDs = [];
  for (const item of newItems) {
    try {
      const newItemID = await add(collection, item);
      newItemIDs.push(String(newItemID));
    } catch (error) {
      res.status(500).send(error);
    }
  }
  return newItemIDs;
};

const techIDsToLink = async (filteredItems) => {
  const newItemIDs = await addNewItems("technologies", filteredItems.newItems);

  const allItemIDs = newItemIDs.concat(filteredItems.existingItems);

  return allItemIDs;
};

const addLinkedItem = async (
  linkedTable,
  mainEntityLabel,
  mainEntityID,
  subEntityLabel,
  subEntityIDs
) => {
  try {
    subEntityIDs.map(async (subEntityID) => {
      await add(linkedTable, {
        [mainEntityLabel]: mainEntityID,
        [subEntityLabel]: subEntityID,
      });
    });
    res.status(201).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addCustomer = async (req, res) => {
  const technologies = req.body.technologies;
  const customerData = req.body.input;

  try {
    const newCustomerID = await add("customers", customerData);
    const TechIDs = await techIDsToLink(itemsFilter(technologies));

    await addLinkedItem(
      `customers_technologies`,
      `customer_id`,
      newCustomerID,
      `technology_id`,
      TechIDs
    );

    res.status(201).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);
router.get("/read/:id", getRow);
router.get("/techs", getAllTechs);
router.post("/create", addCustomer);
router.put("/update/:id", putCustomers);
router.get("/column/:company_name", getAllCustomers);

module.exports = router;
