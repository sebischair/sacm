import express from 'express';
var router = express.Router();
import Model from './../models2/model.process';

router.get('/', (req, res, next)=>{
  let p = new Model.Process({
    name: 'myProcess',
    isRepeatable: false,
    isMandatory: false
  });
  p.save().then(p=>{
    let s = new Model.Stage({
      name: 'myStage',
      isRepeatable: false,
      isMandatory: false,
      owner: 'Max Musterman',
      parent: p._id
    });
    return s.save();
  })
  .then(()=>{    
    res.send('ok');
  });
  
});

module.exports = router;