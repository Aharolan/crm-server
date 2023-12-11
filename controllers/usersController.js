const { get,add,updateData ,getRows} = require("../baseServer");
const express = require("express");
const router = express.Router();

const getAll = async (req,res) => {
    const responseArray = await getRows('users','active',1)
    try {
        res.status(200).send(responseArray)
    }
    catch(error) {
        res.status(500).send(error)
    }

}
  

const getNames = async (req ,res) => {
    const responseNames = await getRows('users', 'role', req.params.role)
    const names = (names) => {
        return[names.id, names.first_name +' '+names.last_name]
    } 
    listNames = Object.fromEntries(responseNames.map(names))
    try {
        res.status(200).send(listNames)
    }
    catch(error) {
        res.status(500).send(error)
    }
  }

const addUser =  async (request, response) => {    
    try{    
    await add('users',request.body); 
    response.send({ message: 'Data added ' });
    }
    catch(error) {
        res.status(500).send(error)
    }
  };
  
  const putUser = async (request,response) => {
    
    await updateData('users',request.body,"id",request.params.id)
    response.send({ message: 'Data for user ${id} updated successfully' });
};

router.get('/names/:role',getNames)
router.get('/',getAll);
router.post('/create',addUser)
router.put('/update/:id',putUser)


module.exports = router;