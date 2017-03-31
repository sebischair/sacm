import express from 'express';

var router = express.Router();
import HumanTask from './../../models/case/model.humantask';


router.get('/', (req, res, next)=>{
  HumanTask.find({})
    .then(cs=>{
        res.status(200).send(cs);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  HumanTask.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.delete('/:id', (req, res, next)=>{
  HumanTask.findById(req.params.id)
    .then(c=>{
        return c.remove();
    })
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.post('/',  (req, res, next)=>{
    new HumanTask({
      name: 'test case'
    }).save().then(cc=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
);


module.exports = router;
