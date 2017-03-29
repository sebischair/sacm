import express from 'express';
var router = express.Router();
import models from './../models';
const StageDefinition = models.StageDefinition;

router.get('/', (req, res, next)=>{

  StageDefinition.create({})
  .then(()=>{
      res.status(200).send('stage def');
  })
  .catch(err=>{
      res.status(500).send(err);
  })
});

module.exports = router;
