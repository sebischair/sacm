import express from 'express';
var router = express.Router();
import CaseDefinition from './../models2/model.casedefinition';


router.get('/', (req, res, next)=>{
  CaseDefinition.find({})
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


router.post('/', (req, res, next)=>{
  new CaseDefinition({
    name: 'test case'
  }).save().then(cd=>{
    res.status(200).send(cd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



module.exports = router;
