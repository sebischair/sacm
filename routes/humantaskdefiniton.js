import express from 'express';
var router = express.Router();
import models from './../models';
const HumanTaskDefinition = models.HumanTaskDefinition;

router.get('/', (req, res, next)=>{

  HumanTaskDefinition.create({})
    .then(()=>{
        res.status(200).send('HumanTaskDefinition def');
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

module.exports = router;
