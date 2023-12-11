const { get, delete_ , add,updateData,getRow} = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req,res) => {
    const responseArray = await get('sorting_schedule')
    try {
        res.status(200).send(responseArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}

const change_relevant_date = async(date_id,command)=>{
    const curent = await getRow('sorting_day' ,"id" , date_id)
    
    if(curent?.quantity_participate ) {

        let _new = {...curent,quantity_participate:  parseInt(curent.quantity_participate || '0') + command}
        await updateData('sorting_day', _new ,'id', curent.id)
    }
  }

const getValuse = async (req ,res) => {
  const responseArray = await getRow('sorting_schedule' ,"id_candidate" ,req.params.id)
  try {
      res.status(200).send(responseArray)
  }
  catch(error) {
      res.status(500).send(error)
  }
}


const putCandidate = async (request,response) => {
    const previous = await getRow('sorting_schedule' ,"id_candidate",request.params.id).then(
        data => data?.date ||''
    )
   const current = request.body.date

    if(previous !== current){
        if (previous) {change_relevant_date(previous,-1)}
         if (current) {change_relevant_date(current,1)}
    }
    await updateData('sorting_schedule',request.body,"id_candidate",request.params.id)

    response.send({ message: 'Data for candidate_id ${id} updated successfully' });
};


router.get('/read/:id',getValuse);
router.get('/',getAll);
router.put('/update/:id',putCandidate)

module.exports = router;