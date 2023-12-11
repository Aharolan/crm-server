const baseServer = require('../baseServer')
const express = require("express");
const router = express.Router();

const addClass = async (req, res) => {
    try {
        const userJson = {
            chief_mentor: req.body.classTeacher,
            start_date: req.body.startDate,
            class_name: req.body.className,
        };
        console.log(userJson)
        const response = await baseServer.put('class', userJson);
        res.status(200).send(response);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}
router.post('/create', addClass);

module.exports = router;

