const { get } = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req, res) => {
  const resArray = await get("INTERVIEWS");
  try {
    res.status(200).send(resArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);

module.exports = router;
