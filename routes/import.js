import express from 'express';
var router = express.Router();
import XMLImporter from './../importer/xmlimporter';


router.get('/', (req, res, next)=>{
  const xml = new XMLImporter();
  xml.import();
  res.send();
});

module.exports = router;