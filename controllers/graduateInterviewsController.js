const { get, updateData } = require("../baseServer");
const express = require("express");
const router = express.Router();
const db = require("../dataBase");

const fetchInterviewsForStudent = (studentId) => {
  const interviewsQuery = `
    SELECT 
      e.event_id,
      c.company_name AS company_name,
      e.position,
      e.text,
      DATE_FORMAT(e.updated_at, '%d/%m/%y') AS date,
      en.name AS event_name,
      CONCAT(s.first_name, ' ', s.last_name) AS student_name
    FROM 
      events e
    LEFT JOIN
      customers c ON e.customer_id = c.customer_id
    INNER JOIN	
      event_names en ON e.event_name_id = en.event_name_id
    LEFT JOIN
      students s ON e.student_id = s.student_id
    WHERE
      (e.student_id = ${db.escape(studentId)}
        AND (e.event_name_id = 5 OR e.event_name_id = 1));
  `;
  return new Promise((resolve, reject) => {
    db.query(interviewsQuery, [studentId], (err, rows) => {
      if (err) {
        console.error("Error fetching interviews data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchMentorCommentsForStudent = (studentId) => {
  const mentorCommentsQuery = `
    SELECT 
      GROUP_CONCAT(text SEPARATOR ' ') AS mentorComment
    FROM 
      feedbacks 
    WHERE
      student_id = ?;
  `;
  return new Promise((resolve, reject) => {
    db.query(mentorCommentsQuery, [studentId], (err, rows) => {
      if (err) {
        console.error("Error fetching mentor comments data:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getAllInterviewsHandler = async (req, res) => {
  try {
    const interviewData = await fetchInterviewsForStudent(req.params.id);
    res.status(200).send(interviewData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getMentorCommentsHandler = async (req, res) => {
  try {
    const mentorCommentData = await fetchMentorCommentsForStudent(
      req.params.id
    );
    res.status(200).send(mentorCommentData);
  } catch (error) {
    res.status(500).send(error);
  }
};

function findChangedEvents(initialEvents, updatedEvents, eventNames) {
  const initialEventsMap = new Map(
    initialEvents.map((obj) => [obj.event_id, obj])
  );
  const changedEvents = updatedEvents.filter((updatedObj) => {
    const initialObj = initialEventsMap.get(updatedObj.event_id);
    return (
      initialObj &&
      (updatedObj.event_name !== initialObj.event_name ||
        updatedObj.text !== initialObj.text)
    );
  });
  const customizedEvents = changedEvents.map((changed) => {
    const text = changed.text;
    const eventName = changed.event_name;
    const eventNameID = eventNames.find(
      (obj) => obj.name === eventName
    )?.event_name_id;
    const eventID = changed.event_id;
    return { event_name_id: eventNameID, event_id: eventID, text: text };
  });
  return customizedEvents;
}

const updateChangedEventsInDB = async (changedEvents) => {
  for (let changedEvent of changedEvents) {
    const { event_id, ...rest } = changedEvent;
    const updatedEventData = {
      event_name_id: changedEvent.event_name_id,
      text: changedEvent.text,
    };
    await updateData("events", updatedEventData, "event_id", event_id);
  }
};

const updateInterviewsHandler = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedEvents = req.body;
    const initialEvents = await fetchInterviewsForStudent(studentId);
    const eventNames = await get("event_names");
    const changedEvents = findChangedEvents(
      initialEvents,
      updatedEvents,
      eventNames
    );
    await updateChangedEventsInDB(changedEvents);
    res.status(200).send("Interviews updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/read/:id", getAllInterviewsHandler);
router.get("/comment/read/:id", getMentorCommentsHandler);
router.put("/update/:id", updateInterviewsHandler);

module.exports = router;
