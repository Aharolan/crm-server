const express = require("express");
const router = express.Router();
const { delete_, add } = require("../baseServer");
const db = require("./../dataBase");

const addCandidate = async (dataUpdated) => {
  try {
    await add("graduates_interviews", dataUpdated);

    console.log("data Added");
  } catch (error) {
    console.log("something went wrong", error);
  }
};
const deleteCandidate = async (interview_id) => {
  try {
    await delete_(
      "graduates_interviews",
      interview_id,
      "graduate_interview_id"
    );
    console.log("data Deleted");
  } catch (error) {
    console.log("something went wrong", error);
  }
};

const getRegistered = (interview_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT s.student_id, concat(s.first_name, " ", s.last_name) as name, graduate_interview_id
      FROM students s, interviews i, graduates_interviews as gi
      WHERE s.student_id = gi.student_id and i.interview_id = gi.interview_id and i.interview_id = ${interview_id}
      ORDER BY name`;
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
const notInNewRegistered = (id, newRegistered) => {
  let count = 0;
  for (let candidate of newRegistered) {
    if (candidate == id) {
      count += 1;
    }
  }
  if (count == 0) {
    return true;
  }
  return false;
  // return !(newRegistered.some((candidate) => candidate == id));
};
const notInRegistered = (candidateId, registered) => {
  let count = 0;
  for (let candidate of registered) {
    if (candidate.student_id == candidateId) {
      count += 1;
    }
  }
  if (count == 0) {
    return true;
  }
  return false;
};
const whichToAdd = (newRegistered, registered, interviewId, toAddList) => {
  for (let candidateId of newRegistered) {
    notInRegistered(candidateId, registered) &&
      toAddList.push({ student_id: candidateId, interview_id: interviewId });
  }
};
const whichToDelete = (newRegistered, registered, interviewId, toDeleteList) => {
  for (let candidate of registered) {
    notInNewRegistered(candidate.student_id, newRegistered) &&
      toDeleteList.push({
        graduate_interview_id: candidate.graduate_interview_id,
      });
  }
};

const getAll = async (req, res) => {
  const id = req.params.id;
  const registered = await getRegistered(id);
  try {
    res.status(200).send(registered);
  } catch (error) {
    res.status(500).send(error);
  }
};
const putCandidate = async (req, res) => {
  const toAddList = [];
  const toDeleteList = [];
  const interviewId = req.body.interviewId;
  console.log( "interviewId is: ", interviewId);
  const newRegistered = req.body.candidatesId;
  console.log("newRegistered is: ", newRegistered);
  const registered = await getRegistered(interviewId);
  console.log("oldregistered is: ", registered);
  whichToAdd(newRegistered, registered, interviewId, toAddList);
  console.log("whichToAdd is: ", toAddList);
  whichToDelete(newRegistered, registered, interviewId, toDeleteList);
  console.log("whichToDelete is: ", toDeleteList);

  toAddList.map((candidate) => addCandidate(candidate));
  toDeleteList.map((interviewId) =>
    deleteCandidate(interviewId.graduate_interview_id)
  );

  res.send({
    message: `Data for interview_id ${interviewId} updated successfully`,
  });
};
router.put("/", putCandidate);
router.get("/read/:id", getAll);
module.exports = router;
