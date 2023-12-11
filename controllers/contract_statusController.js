const { get, updateData,getRow} = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req,res) => {
    const responseArray = await get('contract_details')
    try {
        res.status(200).send(responseArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}
const getValuse = async (req,res) => {
  const responseArray = await getRow('contract_details' ,"id_candidate" ,req.params.id)
  try {
      res.status(200).send(responseArray)
  }
  catch(error) {
      res.status(500).send(error)
  }
}

const putCandidate = async (request,response) => {
    await updateData('contract_details',request.body,'id_candidate',request.params.id)
    response.send({ message: 'Data for candidate_id ${id} updated successfully' });
};


router.get('/read/:id',getValuse);
router.get('/',getAll);
router.put('/update/:id',putCandidate)



module.exports = router;