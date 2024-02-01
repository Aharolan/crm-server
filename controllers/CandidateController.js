const candidate_info_1 = require("./Candidate_infoController")
const candidate_document = require("./candidate_documentsController")
const contract_details = require ("./contract_statusController")
const previous_information = require("./previous_informationController")
const sorting_schedule = require ("./sorting_scheduleController")
const { get, delete_, add, updateData, getRow } = require("../baseServer");

const express = require("express");
const router = express.Router();

const path = require("path");
const parent_dir = path.resolve(__dirname, '..')
const FILES_DIR = path.join(parent_dir, "files")
const fs = require("fs");

const related_tables = ['candidate_documents','candidate_info','contract_details','previous_information','sorting_schedule']

const getAll = async (req, res) => {
    const resArray = await get('candidate')
    try {
        res.status(200).send(resArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}


const deleteCandidate = async (req, res) => {
    const id = req.params.id
    
    try {
      delete_('candidate', id);
      for (related_table of related_tables){
        (related_table !== 'candidate_documents') && await delete_(related_table, id, 'id_candidate'); 
      }
      let candidate_dir = path.join(FILES_DIR, `${id}`);
      if(fs.existsSync(candidate_dir)) {
          fs.rmdirSync(candidate_dir, { recursive: true })
      }
      res.status(200).send("Course deleted successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  };


const addCandidate =  async (req, res) => {
    const id = await add('candidate',req.body);

    for (related_table of related_tables  ){
      await add(related_table,{id_candidate:id }); 
    }
    let candidate_dir = path.join(FILES_DIR, `${id}`);
    if (!fs.existsSync(candidate_dir)) {
        fs.mkdirSync(candidate_dir);
    }
    await updateData('candidate_info', req.body, 'id_candidate', id)
    res.send({ message: 'Data added '});
};


const putCandidate = async (req,res) => {    
    await updateData('candidate',req.body,"id",req.params.id)
    res.send({ message: `Data for candidate_id ${req.params.id} updated successfully` });
};

const getvaluse = async (req, res) => {
    const resArray = await getRow('candidate', "id_candidate", req.params.id)
    try {
        res.status(200).send(resArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
};

router.get('/',getAll);
router.get('/read/:id', getvaluse);
router.delete('/delete/:id',deleteCandidate)
router.post('/create',addCandidate)
router.put('/update/:id',putCandidate)


router.use('/general',candidate_info_1)
router.use('/documents',candidate_document)
router.use('/contract',contract_details)
router.use('/telephon_sort',previous_information)
router.use('/schedule',sorting_schedule)

module.exports = router;
