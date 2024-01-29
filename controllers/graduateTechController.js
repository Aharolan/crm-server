const express = require("express");
const router = express.Router();
const db = require("../dataBase");
const { deleteMultiple, add } = require("../baseServer");

const handleError = (res, errorMessage) => {
  console.error(errorMessage);
  res.status(500).send(errorMessage);
};

const getGraduateTechnologies = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
    gt.graduate_technologies_id,
    t.technology_id as id,
    t.name,
    CASE WHEN gt.technology_id IS NOT NULL THEN TRUE ELSE FALSE END as isSelected
  FROM technologies t
  LEFT JOIN graduates_technologies gt ON t.technology_id = gt.technology_id AND gt.student_id = ?`;
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

const getGraduateTech = async (req, res) => {
  try {
    const resArray = await getGraduateTechnologies(req.params.id);
    res.status(200).send(resArray);
  } catch (error) {
    handleError(res, `Error getting graduates tech, ${error}`);
  }
};

const addTech = async (toUpdate, toAdd, studentId) => {
  try {
    if (toUpdate.length > 0) {
      for (let toUpdateTech of toUpdate) {
        await add("graduates_technologies", toUpdateTech);
      }
    }
    if (toAdd.length > 0) {
      for (let toAddTech of toAdd) {
        const lastID = await add("technologies", toAddTech);
        const addToGraduatesTech = {
          technology_id: lastID,
          student_id: studentId,
        };
        await add("graduates_technologies", addToGraduatesTech);
      }
    }
  } catch (error) {
    console.log("error adding graduate tech", error);
  }
};

const deleteTech = async (graduate_technologies_ids) => {
  try {
    if (graduate_technologies_ids.length > 0) {
      deleteMultiple(
        "graduates_technologies",
        graduate_technologies_ids,
        "graduate_technologies_id"
      );
    }
  } catch (error) {
    console.log("error deleting graduate tech", error);
  }
};

const getTechAdditionsAndUpdates = (updatedTech, initialTech, studentId) => {
  const techToUpdate = [];
  const techToAdd = [];
  const initialTechMap = new Map(initialTech.map((tech) => [tech.id, tech]));

  updatedTech.forEach((updatedTechItem) => {
    const initialTechItem = initialTechMap.get(updatedTechItem.id);

    if (!initialTechItem && updatedTechItem.isSelected) {
      techToAdd.push({ name: updatedTechItem.name });
    } else if (
      initialTechItem &&
      initialTechItem.isSelected === 0 &&
      (updatedTechItem.isSelected || updatedTechItem.isSelected === 1)
    ) {
      techToUpdate.push({
        technology_id: updatedTechItem.id,
        student_id: studentId,
      });
    }
  });

  return { update: techToUpdate, add: techToAdd };
};

const getTechDeletions = (updatedTech, initialTech) => {
  return initialTech
    .filter((initialTechItem) => {
      const isSelectedInInitialTech = Boolean(initialTechItem.isSelected);
      const matchingTech = updatedTech.find(
        (tech) => tech.id === initialTechItem.id
      );
      if (matchingTech) {
        const isSelectedInUpdatedTech =
          typeof matchingTech.isSelected === "boolean"
            ? matchingTech.isSelected
            : Boolean(matchingTech.isSelected);
        return isSelectedInInitialTech && !isSelectedInUpdatedTech;
      }
      return isSelectedInInitialTech;
    })
    .map((techItem) => {
      const { graduate_technologies_id, ...rest } = techItem;
      return graduate_technologies_id;
    });
};

const updateGraduateTech = async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const updatedTech = req.body.updatedTech;
    let initTech;
    try {
      initTech = await getGraduateTechnologies(studentId);
    } catch (error) {
      handleError(res, `Error getting graduates tech initial, ${error}`);
      return;
    }
    const toAddList = getTechAdditionsAndUpdates(
      updatedTech,
      initTech,
      studentId
    );
    const toDeleteList = getTechDeletions(updatedTech, initTech);
    try {
      if (toDeleteList.length > 0) {
        await deleteTech(toDeleteList);
      }

      if (toAddList.add.length > 0 || toAddList.update.length > 0) {
        await addTech(toAddList.update, toAddList.add, studentId);
      }

      res.status(200).send("Graduate tech updated successfully");
    } catch (error) {
      handleError(res, `Error updating graduates tech, ${error}`);
    }
  } catch (error) {
    handleError(res, `Unexpected error in updateGraduateTech, ${error}`);
  }
};

router.get("/read/:id", getGraduateTech);
router.put("/update/:id", updateGraduateTech);
module.exports = router;
