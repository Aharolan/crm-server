const { get, delete_, add, updateData, getRow, getRows } = require("../baseServer");
const express = require("express");
const router = express.Router();

//missing a option to join also a count of student with same class_name .
// it will be coming with getRowAndCounting function in baseServer 
const getAllClasses = async (req, res) => {
    const resArray = await get('classes')
    try {
        res.status(200).send(resArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}

const addClass = async (req, res) => {
    try {
        const response = await add('classes', req.body);
        res.json(200, {result: response});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

const deleteClass = async (req, res) => {
    const id = req.params.id
    try {
        delete_('classes', id);
        res.status(200).send("Class deleted successfully");
        } catch (error) {
        res.status(500).send(error);
    }
};
    
const putClass = async (req,res) => {    
    await updateData('classes',req.body,"id",req.params.id)
    res.send({ message: `Data for class_id ${req.params.id} updated successfully` });
};
    
const getClass = async (req, res) => {
        try {
            const classDic = await getRow('classes','id', req.params.id)
            const studentsOfClass = await getRows('students','class_name',classDic.class_name)
            const resArray = {
                class:classDic,
                students:studentsOfClass
            }

            res.status(200).send(resArray)
        }
        catch(error) {
            res.status(500).send(error)
        }
}

router.post('/create', addClass);
router.get('/',getAllClasses);
router.get('/read/:id', getClass);
router.delete('/delete/:id',deleteClass)
router.put('/update/:id',putClass)

module.exports = router;

