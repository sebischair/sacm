import express from 'express';
var router = express.Router();
import CaseDefinition from './../models2/model.casedefinition';
import ProcessDefinition from './../models2/model.processdefinition';
import StageDefinition from './../models2/model.stagedefinition';
import TaskDefinition from './../models2/model.taskdefinition';

router.get('/', (req, res, next)=>{

  let cd = null;
  let s1_1 = null;
  let s2_1 = null;
  let s2_2 = null;
  let s3_1 = null;

  new CaseDefinition({
    name: 'Case Study 3'
  }).save()
  .then(c=>{
    cd = c;
    return new StageDefinition({
      caseDefinition: cd._id,
      name: 'Stage1.1',
      isRepeatable: false,
      isMandatory: false,
      parent: null
    }).save();
  })
  .then(s=>{
    s1_1 = s;
    return new StageDefinition({
      caseDefinition: cd._id,
      name: 'Stage2.1',
      isRepeatable: false,
      isMandatory: false,
      parent: s1_1._id
    }).save();
  })
  .then(s=>{
    s2_1 = s;
    return new StageDefinition({
      caseDefinition: cd._id,
      name: 'Stage2.2',
      isRepeatable: false,
      isMandatory: false,
      parent: s1_1._id
    }).save();
  })
  .then(s=>{
    s2_2 = s;
    return new StageDefinition({
      caseDefinition: cd._id,
      name: 'Stage3.1',
      isRepeatable: false,
      isMandatory: false,
      parent: s2_1._id
    }).save();
  })
  .then(s=>{ 
    s3_1  = s; 
    return new TaskDefinition({
      caseDefinition: cd._id,
      name: 'Task2.1',
      isRepeatable: false,
      isMandatory: false,
      owner: 'Max Musterman',
      parent: s1_1._id,
      param: [{isReadOnly: Boolean, attrDef: null}]
    }).save();    
  })
  .then(t2_1=>{
    return ProcessDefinition.findSubById(s1_1._id);
  })
  .then(subProcesses=>{
    console.log('findSubProcesses')
    console.log(subProcesses);
    return StageDefinition.findSubById(s1_1._id);
  })
  .then(subStages=>{
    console.log('findSubStages')
    console.log(subStages);
    res.send('ok');
  });
  
});

module.exports = router;