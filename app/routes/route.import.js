import express from 'express';
var router = express.Router();
import XMLImporter from './../importer/xmlimporter';


router.get('/', (req, res, next)=>{
  const xml = new XMLImporter();
  xml.import('app/importer/barcelona.xml')
    .then(()=>{
      res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err)
    });
});

module.exports = router;
