const { get } = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req, res) => {
  const responseArray = await get("customers");
  try {
    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

router.get("/", getAll);

module.exports = router;
