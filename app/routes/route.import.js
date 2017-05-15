import express from 'express';
var router = express.Router();
import XMLImporter from './../importer/xmlimporter';


router.get('/', (req, res, next)=>{
  const xml = new XMLImporter();
  xml.import('app/importer/democase.xml')
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});

module.exports = router;
