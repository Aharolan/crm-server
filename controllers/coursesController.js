const { getActive, delete_, add, updateData, getRow, getRowsActive } = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAllCourses = async (req, res) => {
    const resArray = await getActive('courses')
    try {
        res.status(200).send(resArray)
    }
    catch (error) {
        res.status(500).send(error)
    }
}

const deleteCourse = async (req, res) => {
    const id = req.params.id;

    try {
        delete_('courses', id);
        res.status(200).send("Student deleted successfully");
    } catch (error) {
        res.status(500).send(error);
    }
};

const addCourses = async (req, res) => {
    const id = await add('courses', req.body);
    res.send({ message: 'Data added ' });
};

const putCourses = async (req, res) => {
    await updateData('courses', req.body, "id", req.params.id)
    res.send({ message: `Data for Id ${req.params.id} updated successfully` });
};

const getCourse = async (req, res) => {
    const resArray = await getRow('courses', "id", req.params.id)
    try {
        res.status(200).send(resArray)
    }
    catch (error) {
        res.status(500).send(error)
    }
};

const getCourses = async (req, res) => {
    const resArray = await getRowsActive('courses', 'course', req.params.class_name)
    try {
        res.status(200).send(resArray)
    }
    catch (error) {
        res.status(500).send(error)
    }
};

router.get('/', getAllCourses);
router.get('/read/:id', getCourse);
router.get('/reads/:class', getCourses);
router.delete('/delete/:id', deleteCourse)
router.post('/create', addCourses)
router.put('/update/:id', putCourses)

module.exports = router;
