const db = require("./dataBase");

const get = (collection) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${collection}`;
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const getRow = (collection, id_column, id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${collection} WHERE ${id_column} = ?`;
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

const getRows = (collection, id_column, id) => {
  if (Array.isArray(id) && id.length == 0) {
    console.log("not id");
    return [];
  }

  if (!Array.isArray(id)) {
    id = [id];
  }
  let query_rep = id.map((ele) => `'${ele}'`).join(",");

  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${collection} WHERE ${id_column} IN (${query_rep})`;
    db.query(query, [], (err, row) => {
      if (err) {
        console.error("Error fetching data:", err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const add = (collection, data) => {
  return new Promise((resolve, reject) => {
    let keys = Object.keys(data);
    let values = Object.values(data);

    // Avoid overwriting the id column
    let index_of_id = keys.indexOf("id");
    if (index_of_id !== -1) {
      values.splice(index_of_id, 1);
      keys.splice(index_of_id, 1);
    }

    const query = `INSERT INTO ${collection} (${keys.join(", ")}) VALUES (?)`;

    db.query(query, [values], (err, results) => {
      if (err) {
        reject(err); // Handle errors and reject the Promise
      } else {
        db.query("SELECT LAST_INSERT_ID() as lastId", (err, results) => {
          if (err) {
            reject(err); // Handle errors and reject the Promise
          } else {
            console.log("Last inserted ID:", results[0].lastId);
            resolve(results[0].lastId); // Resolve the Promise on success
          }
        });
      }
    });
  });
};

const delete_ = (collection, id, id_column = "id") => {
  const query = `DELETE FROM ${collection} WHERE ${id_column} = ? `;
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
    } else {
      console.log(`Data with id ${id} deleted successfully`);
    }
  });
};

const deleteMultiple = (collection, ids) => {
  const placeholders = ids.map(() => "?").join(",");
  const query = `DELETE FROM ${collection} WHERE id IN (${placeholders})`;

  db.query(query, ids, (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
    } else {
      console.log(`Data with ids ${ids} deleted successfully`);
    }
  });
};

const updateData = (collection, data, id, idvalue) => {
  let keys = Object.keys(data);
  let values = Object.values(data);

  // Avoid overwriting the id column
  let index_of_id = keys.indexOf("id");
  if (index_of_id !== -1) {
    values.splice(index_of_id, 1);
    keys.splice(index_of_id, 1);
  }

  // Create SET part of the query
  const setClause = keys.map((key) => `${key} = ?`).join(",");

  // Create the parameterized query
  const query = `UPDATE ${collection} SET ${setClause} WHERE ${id} = ?`;

  // Add the idvalue to the values array
  values.push(idvalue);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating data:", err);
    } else {
      console.log(`Data for ${keys} updated successfully`);
    }
  });
};

module.exports = {
  get,
  delete_,
  deleteMultiple,
  add,
  updateData,
  getRow,
  getRows,
};
