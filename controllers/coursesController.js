const { get, delete_ } = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req,res) => {
    const responseArray = await get('courses')
    try {
        res.status(200).send(responseArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}

const deleteCourse = async (req, res) => {
    const courseId = req.params.id;
    
    try {
      await delete_('courses', courseId);
      res.status(200).send("Course deleted successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  };

router.get('/',getAll);
router.delete('/delete/:id',deleteCourse)

module.exports = router;
