const {
  getColumns,
  delete_,
  add,
  updateData,
  getRowsActive,
  getRows,
} = require("../baseServer");
const {
  convertArrayToCamelCase,
  convertArrayToSnakeCase,
} = require("./convertToCamelCase");

const express = require("express");
const router = express.Router();

const getAllStudents = async (req, res) => {
  const resArray = await getColumns(
    "crm_db.students",
    "student_id, first_name, last_name, phone_number, email, class_id"
  );
  const camelCaseArray = convertArrayToCamelCase(resArray);
  try {
    res.status(200).send(camelCaseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;

  try {
    delete_("crm_db.students", id, "student_id");
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const addStudent = async (req, res) => {
  const id = await add("crm_db.students", convertArrayToSnakeCase(req.body));
  res.send({ message: "Data added " });
};

const putStudent = async (req, res) => {
  await updateData(
    "students",
    convertArrayToSnakeCase(req.body),
    "student_id",
    req.params.id
  );
  res.send({
    message: `Data for id ${req.params.id} updated successfully 'body Hersey claims:', ${req.body}`,
  });
};

const getStudent = async (req, res) => {
  const resArray = await getRows("students", "student_id", req.params.id);
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getStudents = async (req, res) => {
  const resArray = await getRowsActive("students", "class", req.params.class);
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAllStudents);
router.get("/read/:id", getStudent);
router.get("/reads/:class", getStudents);
router.delete("/delete/:id", deleteStudent);
router.post("/create", addStudent);
router.put("/update/:id", putStudent);
module.exports = router;
