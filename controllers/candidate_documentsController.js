
const base = require("../baseServer");
const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");

const parent_dir = path.resolve(__dirname, '..')
const FILES_DIR = path.join(parent_dir, "files")


function base64ToArrayBuffer(base64) {
  return Buffer.from(base64, 'base64');
}


const getAll = async (req,res) => {
    const resArray = await base.get('candidate_documents')
    try {
        res.status(200).send(resArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
}

const getValuse = async (req,res) => {
    
    try {
      const resArray = await base.getRows('candidate_documents' ,"id_candidate" ,req.params.id)
      
      res.status(200).send(resArray)
    }
    catch(error) {
        res.status(500).send(error)
    }
  }


const needToDelete = async (updatedList, id) => {
  return base.getRows('candidate_documents' ,"id_candidate" ,id).then(
      cerrentDocs => {
        if(!cerrentDocs) return [];

      if(!Array.isArray(cerrentDocs)) cerrentDocs = [cerrentDocs];

      let updatedIds = updatedList.map(doc => doc.id)
      let todelete = cerrentDocs.filter(doc => !updatedIds.includes(doc.id))
    
      return todelete.map(doc => doc.id)
    }
    )
  }


const savepdf = (base64, id, name) => {
  let filePath = path.join(`${FILES_DIR}/${id}/${name}.pdf`);
  let arrayBuffer1 = base64ToArrayBuffer(base64.split(',')[1]);
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer1), 'binary'); 
};

  
 
/**
 * Given an array of documents, and a candidate id.
 * 
 * Identify which is new/updated, 
 * and which are missing and need to be deleted
 */
const updateDocuments = async (req,res) => {
  let id_candidate = req.params.id;
  let documents = req.body.documents;
  
  needToDelete(documents, id_candidate).then(
    x => x && base.deleteMultiple('candidate_documents',x)
    )

  documents.forEach( async doc => 
    {
      let content = doc.document_file || ''
      doc['document_file'] = content ? 'placeholder' : content
      if(doc.id){
        await base.updateData('candidate_documents',doc, 'id', doc.id)
      } else {
        doc['id_candidate'] = id_candidate
        doc.id = await base.add('candidate_documents', doc)
      }
      if(content.length > 100) savepdf(content,doc.id_candidate,doc.id)

  })
    res.send({ message: `Data for candidate_id ${id_candidate} updated successfully` });
};



router.get('/read/:id',getValuse);
router.get('/',getAll);
router.put('/update/:id',updateDocuments)



module.exports = router;