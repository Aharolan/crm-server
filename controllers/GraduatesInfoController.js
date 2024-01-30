const { get, add, updateData } = require("../baseServer");
const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const getMilestones = (id) => {
  const query = `
  SELECT 
  e.event_id,
  c.company_name AS company_name,
  e.position,
  DATE_FORMAT(e.updated_at, '%d/%m/%y') AS date,
  en.name AS event_name,
  (SELECT DATE_FORMAT(c.start_date, '%d/%m/%y') AS start_date FROM students s JOIN classes c ON s.class_id = c.class_id WHERE s.student_status_id = ${db.escape(
    id
  )} LIMIT 1) AS start_date,
  CONCAT(s.first_name, ' ', s.last_name) AS name
FROM 
  events e
LEFT JOIN
  customers c ON e.customer_id = c.customer_id
RIGHT JOIN	
  event_names en ON e.event_name_id = en.event_name_id
LEFT JOIN
  students s ON e.student_id = s.student_id
WHERE
  e.student_id = ${db.escape(id)}`;
  return new Promise((resolve, reject) => {
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

const getRow = async (req, res) => {
  try {
    const responseArray = await getMilestones(req.params.id);
    // console.log("response from server", responseArray);
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

function getChangedEvents(initial, updated, eventNames) {
  // Create a map for quick lookup of initial events based on event_id
  const initialMap = new Map(initial.map((obj) => [obj.event_id, obj]));

  // Filter out objects where event_name is different between initial and updated
  const changedEvents = updated.filter((updatedObj) => {
    const initialObj = initialMap.get(updatedObj.event_id);
    return initialObj && updatedObj.event_name !== initialObj.event_name;
  });
  const updatedEvents = changedEvents.map((changed) => {
    const eventName = changed.event_name;
    const eventNameID = eventNames.find(
      (obj) => obj.name === eventName
    )?.event_name_id;
    const eventID = changed.event_id;
    return { event_name_id: eventNameID, event_id: eventID };
  });
  const MilestoneToADd = updated.filter((obj) => !obj.event_id);

  return { updatedEvents, MilestoneToADd };
}

// Example usage
// const changedEvents = getChangedEvents(initial, updated, 5);
// console.log(changedEvents);

const updateDB = async (changedEvents, addedEvents, id) => {
  console.log("Update DB called");
  console.log(changedEvents, "changed events");
  for (let changedEvent of changedEvents) {
    const { event_id, ...removeEventId } = changedEvent;
    const customObject = { event_name_id: changedEvent.event_name_id };
    await updateData("events", customObject, "event_id", event_id);
  }
  for (let addedEvent of addedEvents) {
    const { date, ...removeEventId } = addedEvent;
    const customObject = { date: date, student_id: id, event_name_id: 5, position: "bengemin" };
    await add("events", customObject);
  }
};
const putMilestones = async (req, res) => {
  console.log("updated info send from the client", req.body[0]);
  try {
    const studentId = req.params.id;

    const updated = req.body;

    // Wait for the initial data to be fetched before proceeding
    const initial = await getMilestones(studentId);
    const eventNames = await get("event_names");
    const changedEvents = getChangedEvents(
      initial,
      updated,
      eventNames
    ).updatedEvents;
    const MilestoneToADd = getChangedEvents(
      initial,
      updated,
      eventNames
    ).MilestoneToADd;

    updateDB(changedEvents, MilestoneToADd, studentId); // <-- Update this line
  } catch (error) {
    console.log("the error is:", error);
    res.status(500).send(error);
  }
};


router.get("/read/:id", getRow);
router.put("/update/:id", putMilestones);

module.exports = router;
