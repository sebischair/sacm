import express from 'express';
var router = express.Router();
import models from './../models';
const StageDefinition = models.StageDefinition;


/* GET users listing. */
router.get('/', (req, res, next)=>{

  StageDefinition.findOne({where: {id: 1}})
  .then( (sd) => {
    res.status(200).json(sd);
  });



  /*
  CaseDefinition.create({name: 'megaCool'})
  .then((x)=>{
      res.status(200).send(x);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
  */

});


router.get('/sub', (req, res, next)=>{
  StageDefinition.findOne({where: {id: 2}})
  .then( (sd) => {
    return sd.getSubStages();
  })
  .then((ssd) => {
    res.status(200).json(ssd);
  })
});

/* POST create case definition */
router.post('/', (req, res, next)=>{
  StageDefinition.createStage({name: 'CooleStage', parentId: 2, isMandatory: true, isRepeatable: false})
  .then( (result) => {
    res.status(200).json(result);
  });
});



module.exports = router;
