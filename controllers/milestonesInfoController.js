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

const getAllMilestones = async (req, res) => {
  try {
    const responseArray = await getMilestones(req.params.id);
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

function getChangedEvents(initialMilestones, updatedMilestones, eventNames) {
  const initialMap = new Map(
    initialMilestones.map((obj) => [obj.event_id, obj])
  );

  const changedEvents = updatedMilestones.filter((updatedObj) => {
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
  const MilestoneToAdd = updatedMilestones.filter((obj) => !obj.event_id);
  return { updatedEvents, MilestoneToAdd };
}

const updateDB = async (changedEvents, addedEvents, id) => {
  let eventNamesMap = new Map();
  let companiesMap = new Map();

  if (addedEvents.length > 0) {
    eventNamesMap = new Map(
      (await get("event_names")).map((obj) => [obj.name, obj.event_name_id])
    );
    companiesMap = new Map(
      (await get("customers")).map((obj) => [obj.company_name, obj.customer_id])
    );
  }

  for (let changedEvent of changedEvents) {
    const { event_id, ...removeEventId } = changedEvent;
    const customObject = { event_name_id: changedEvent.event_name_id };
    await updateData("events", customObject, "event_id", event_id);
  }

  for (let addedEvent of addedEvents) {
    const eventNameId = eventNamesMap.get(addedEvent.event_name);
    const customerId = companiesMap.get(addedEvent.company_name);

    const { date, position, ...removeEventId } = addedEvent;
    const customObject = {
      date: date,
      student_id: id,
      event_name_id: eventNameId,
      position: position,
      customer_id: customerId,
    };
    await add("events", customObject);
  }
};

const putMilestones = async (req, res) => {
  try {
    const studentId = req.params.id;

    const updated = req.body;

    const initial = await getMilestones(studentId);
    const eventNames = await get("event_names");
    const changedEvents = getChangedEvents(
      initial,
      updated,
      eventNames
    ).updatedEvents;
    const MilestoneToAdd = getChangedEvents(
      initial,
      updated,
      eventNames
    ).MilestoneToAdd;

    updateDB(changedEvents, MilestoneToAdd, studentId);
    res.status(200).send("Milestones updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/read/:id", getAllMilestones);
router.put("/update/:id", putMilestones);

module.exports = router;
