import express from 'express';
var router = express.Router();
import models from './../models';
const CaseDefinition = models.CaseDefinition;


/* GET users listing. */
router.get('/', (req, res, next)=>{

  CaseDefinition.create({name: 'testcase'})
  .then(()=>{
      res.status(200).send('case def');
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});

module.exports = router;
