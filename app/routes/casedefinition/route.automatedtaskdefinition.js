import express from 'express';
var router = express.Router();
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';


router.get('/', (req, res, next)=>{
  AutomatedTaskDefinition.find({})
    .then(sds=>{
        res.status(200).send(sds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.delete('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.findById(req.params.id)
    .then(sd=>{
        console.log(sd);
        return sd.remove();
    })
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.post('/', (req, res, next)=>{
  new AutomatedTaskDefinition({
    caseDefinition: null,
    name: String,
    isRepeatable: Boolean,
    isMandatory: Boolean,
    parent: null,
    preconditions: [],
    owner: 'Max Musterman',
  }).save().then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});

module.exports = router;