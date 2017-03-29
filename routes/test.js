import express from 'express';
var router = express.Router();
import ProcessDefinition from './../models2/model.processdefinition';
import StageDefinition from './../models2/model.stagedefinition';

router.get('/', (req, res, next)=>{
  let p = new ProcessDefinition({
    name: 'myProcess',
    isRepeatable: false,
    isMandatory: false
  });
  p.save().then(p=>{
    let s = new StageDefinition({
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