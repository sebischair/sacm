import express from 'express';
var router = express.Router();
import models from './../models';
const CaseDefinition = models.CaseDefinition;


/* GET users listing. */
router.get('/', (req, res, next)=>{

  CaseDefinition.findOne({where: {id: 1}})
  .then( (cd) => {
    console.log(cd.gambo);
    res.status(200).json(cd.gambo('jambo'));
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


/* POST create case definition */
router.post('/', (req, res, next)=>{
  console.log('here4');
  res.status(200).json({asd:2323});

});



module.exports = router;
