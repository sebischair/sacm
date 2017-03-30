import express from 'express';
var router = express.Router();
import SentryDefinition from './../models/model.sentrydefinition';


router.get('/', (req, res, next)=>{
  SentryDefinition.find({})
    .then(sds=>{
        res.status(200).send(sds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  SentryDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.delete('/:id', (req, res, next)=>{
  SentryDefinition.findById(req.params.id)
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
  new SentryDefinition({
    caseDefinition: null,
    name: String,
    isRepeatable: Boolean,
    isMandatory: Boolean,
    parent: null,
    preconditions: []
  }).save().then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



module.exports = router;
