const { get, delete_ , add,updateData , getRow, getRows} = require("../baseServer");
const { formatDate } = require("../utils/dateFormatter");
const express = require("express");
const router = express.Router();



const getAll = async (req,res) => {
    try {    
      const responseArray = await get('sorting_day')
      const formattedResponseArray = responseArray.map(day => ({
        ...day,
        date: formatDate(day.date, 'dd/mm/yyyy')
      }));
        res.status(200).send(formattedResponseArray)
      // console.log(responseArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}


const getDayData = async (req,res) => {
  try {
    let sorting_day = await getRow('sorting_day' ,"id" ,req.params.id)
    let related_candidates = await getRows('sorting_schedule', 'date', sorting_day.id )
    
    let id_to_status = Object.fromEntries(
      related_candidates.map(c => [c.id_candidate, c.status])
      )
  
    let candidates = await getRows('candidate', 'id', Object.keys(id_to_status))
    candidates = candidates.map(can => ({...can, status: id_to_status[can.id]}))
    
    sorting_day.date = formatDate(sorting_day.date);

    let response = {...sorting_day, candidates: candidates }

    res.status(200).send(response)
  }
  catch(error) {
      res.status(500).send(error)
  }
}



const getDates = async (req,res) =>{
  try {
    dates = await get('sorting_day')
      
    datesList = Object.fromEntries(dates.map(day => [day.id, formatDate(day.date)]))

    res.status(200).send(datesList)
  }
  catch(error) {
      res.status(500).send(error)
  }
}

const deleteDay = async (req, res) => {
    const id = req.params.id;
    
    try {
      await delete_('sorting_day', id,'id');
      res.status(200).send("Course deleted successfully");
    } catch (error) {
      res.status(500).send(error);
    }
};


const addDay =  async (request, response) => {
  try {
    delete request.body['candidates']
    await add('sorting_day',request.body); 
    response.status(200).send({ message: 'Data added ' });
  } catch(error){
      response.status(500)
  }
};

  
const updateDay = async (request,response) => {
    try {
      await updateData('sorting_day',request.body,'id',request.params.id)
    response.status(200).send({ message: 'Data for candidate_id ${id} updated successfully' });
    } catch(error){
      response.status(500)
    }
};


router.get('/read/:id',getDayData);
router.get('/',getAll);

router.delete('/delete/:id',deleteDay)
router.post('/create',addDay)
router.put('/update/:id',updateDay)
router.get('/getDates',getDates)

module.exports = router;
