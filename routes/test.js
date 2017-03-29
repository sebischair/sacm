import express from 'express';
var router = express.Router();
import ProcessDefinition from './../models2/model.processdefinition';
import StageDefinition from './../models2/model.stagedefinition';
import TaskDefinition from './../models2/model.taskdefinition';

router.get('/', (req, res, next)=>{

  let p = new ProcessDefinition({
    name: 'myProcess',
    isRepeatable: false,
    isMandatory: false
  }).save().then(p=>{
    let s = new StageDefinition({
      name: 'myStage',
      isRepeatable: false,
      isMandatory: false,
      owner: 'Max Musterman',
      parent: p._id
    });
    return s.save();
  })
  .then(s=>{    
    return ProcessDefinition.findSubProcesses(p._id);
  })
  .then(subProcesses=>{
    return new TaskDefinition({
      name: 'myStage',
      isRepeatable: false,
      isMandatory: false,
      owner: 'Max Musterman',
      parent: null,
      param: '23'
    }).save();
  })
  .then(taskDef=>{
    console.log(taskDef);
    res.send('ok');
  });
  
});

module.exports = router;