import express from 'express';

var router = express.Router();
import Case from './../../models/case/model.case';


router.get('/', (req, res, next)=>{
  Case.find({})
    .then(cs=>{
        res.status(200).send(cs);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  Case.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.delete('/:id', (req, res, next)=>{
  Case.findById(req.params.id)
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
    new Case({
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
