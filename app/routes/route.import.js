import express from 'express';
var router = express.Router();
import XMLImporter from './../importer/xmlimporter';


router.post('/', (req, res, next)=>{
  const xml = new XMLImporter();
  let file = 'democase.xml';
  let isExecuteCase = false;
  if(req.params.file)
    file = req.params.file;
  if(req.params.execute)
    isExecuteCase = true;
  xml.import('app/importer/'+file, isExecuteCase)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});

module.exports = router;
