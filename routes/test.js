import express from 'express';
var router = express.Router();
import ProcessDefinition from './../models2/model.processdefinition';
import StageDefinition from './../models2/model.stagedefinition';
import TaskDefinition from './../models2/model.taskdefinition';

router.get('/', (req, res, next)=>{

  let s1_1 = null;
  let s2_1 = null;
  let s2_2 = null;
  let s3_1 = null;

  new StageDefinition({
    name: 'Stage1.1',
    isRepeatable: false,
    isMandatory: false,
    parent: null
  })
  .save().then(s=>{
    s1_1 = s;
    return new StageDefinition({
      name: 'Stage2.1',
      isRepeatable: false,
      isMandatory: false,
      parent: s1_1._id
    }).save();
  })
  .then(s=>{
    s2_1 = s;
    return new StageDefinition({
      name: 'Stage2.2',
      isRepeatable: false,
      isMandatory: false,
      parent: s1_1._id
    }).save();
  })
  .then(s=>{
    s2_2 = s;
    return new StageDefinition({
      name: 'Stage2.2',
      isRepeatable: false,
      isMandatory: false,
      parent: s2_1._id
    }).save();
  })
  .then(s=>{ 
    s3_1  = s; 
    return ProcessDefinition.findSubProcesses(s1_1._id);
  })
  .then(subProcesses=>{
    console.log(subProcesses);
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
    res.send('ok');
  });
  
});

module.exports = router;