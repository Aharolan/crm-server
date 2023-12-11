const { get, updateData , getRow} = require("../baseServer");
const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");


const parent_dir = path.resolve(__dirname, '..')
const FILES_DIR = path.join(parent_dir, "files")

const getAll = async (req,res) => {
    const responseArray = await get('candidate_info')
    try {
      res.status(200).send(responseArray)
        
    }
    catch(error) {
        res.status(500).send(error)
    }
}

const getValuse = async (req,res) => {
    let filePath = path.join(`${FILES_DIR}/${req.params.id}/${req.params.id}.txt`)
    try{
      const responseArray = await getRow('candidate_info' ,"id_candidate" ,req.params.id)
      try{
        responseArray.image_path =   fs.readFileSync(filePath, 'utf8');
      }catch{} 
        res.status(200).send(responseArray)
    }
    catch(error) {
      res.status(500).send(error)
    }
}

const saveimg= (base64, name) => {
  let filePath = path.join(`${FILES_DIR}/${name}/${name}.txt`);
   fs.writeFileSync(filePath, base64, 'utf8');
};


const putCandidate = async (req,res) => {
    await saveimg(req.body.image_path,req.body.id_candidate);
    req.body.image_path=req.params.id
    
    await updateData('candidate_info',req.body,'id_candidate',req.params.id)
    let x = ['first_name', 'last_name', 'status',	'email', 'id_number', 'phone','relevant_class']
    let basic = Object.fromEntries(
      Object.entries(req.body).filter(([key, _]) => x.includes(key))
    )
    await updateData('candidate', basic,'id',req.params.id)
    res.send({ message: 'Data for candidate_id ${id} updated successfully' });
};


router.get('/read/:id',getValuse);
router.get('/',getAll);
router.put('/update/:id',putCandidate)


module.exports = router;
