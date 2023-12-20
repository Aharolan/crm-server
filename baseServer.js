const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./student.sqlite/candidate_list.db');


const get = (collection) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${collection}`;
        db.all(query, (err, rows) => { 
            if (err) {
                console.error('Error fetching data:', err);
                reject(err);
            } else {
                resolve(rows);
            }
                    });;
                }).then(data => {
                    return data
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
};

const getRow = (collection, id_column, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${collection} WHERE ${id_column} = ?`;
        db.get(query, id, (err, row) => {
            if (err) {
                console.error('Error fetching data:', err);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getRows = (collection, id_column, id) => {
    if(!Array.isArray(id)){ id = [id]};
    let query_rep = id.map(ele => `'${ele}'`).join(',')
    
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${collection} WHERE ${id_column} IN (${query_rep})`;
        db.all(query, (err, row) => {
            if (err) {
                console.error('Error fetching data:', err);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
        
const add = (collection, data) => {
    return new Promise((resolve, reject) =>{                
                
    let keys = Object.keys(data)
    let values = Object.values(data) 
       
    // Avoid overwriting the id column
    let index_of_id = keys.indexOf('id')
    if(index_of_id !== -1){
        values.splice(index_of_id, 1)
        keys.splice(index_of_id, 1)
    }
    const query = `INSERT INTO ${collection} (${keys}) VALUES (${'?,'.repeat(keys.length).slice(0, -1)})`;
    
    db.run(query, values, ( err) => {
        if (err) {
            console.error('Error adding data:', err);
        } else {
            db.get("select last_insert_rowid() as lastId" ,(err,row)=> {
                if (err) {
                    console.log(err)
                    reject(err)  
                }
                else {  
                    resolve(row.lastId)
                }
            })
            console.log('Data added successfully');                  
                
            }
        });
    })
};


const delete_ =  (collection ,id, id_column='id') => {            
    const query = `DELETE FROM ${collection} WHERE ${id_column} = ? `;        
    db.run(query, id, (err) => {
        if (err) {
            console.error('Error deleting data:', err);
        } else {
            console.log(`Data with id ${id} deleted successfully`);
        }
    });
};


const deleteMultiple = (collection, ids) => {
    const query = `DELETE FROM ${collection} WHERE id IN (${ids.join(',')})`;
    
    db.run(query, (err) => {
        if (err) {
            console.error('Error deleting data:', err);
        } else {
            console.log(`Data with id ${ids} deleted successfully`);
        }
    });
}

const updateData = ( collection,data ,id,idvalue ) => {
    let keys = Object.keys(data)
    let values = Object.values(data)

    // Avoid overwriting the id column
    let index_of_id = keys.indexOf('id')
    if(index_of_id !== -1){
        values.splice(index_of_id, 1)
        keys.splice(index_of_id, 1)
    }

    const query = `UPDATE ${collection} SET ${(keys.map(key => `${key} = ?`).join(','))} WHERE ${id} = ${idvalue}`;
    
    db.run(query, values, (err) => {
        if (err) {
            console.error('Error updating data:', err);
        } else {
            console.log(`Data for  ${keys} updated successfully`);
        }
    });
};
        

module.exports = { get, delete_ ,deleteMultiple,  add , updateData, getRow, getRows};
