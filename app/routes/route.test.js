import express from 'express';
import Promise from 'bluebird';
import Workspace from '../models/workspace/model.workspace';
import UserDefinition from '../models/group/model.userdefinition';
import User from '../models/group/model.user';
import Group from '../models/group/model.group';
import EntityDefinition from '../models/datadefinition/model.entitydefinition';
import AttributeDefinition from '../models/datadefinition/model.attributedefinition';
import DerivedAttributeDefinition from '../models/datadefinition/model.derivedattributedefinition';
import CaseDefinition from '../models/casedefinition/model.casedefinition';
import StageDefinition from '../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from '../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from '../models/casedefinition/model.automatedtaskdefinition';
import TaskParamDefinition from '../models/casedefinition/model.taskparamdefinition';
import HttpHookDefinition from '../models/casedefinition/model.httphookdefinition';
import SentryDefinition from '../models/casedefinition/model.sentrydefinition';
import Case from '../models/case/model.case';
import HumanTask from '../models/case/model.humantask';
const router = express.Router();

router.get('/visualvm', (req, res, next)=>{
  Case.create(req.jwt, {caseDefinition: "ph269ah911l"})
    .then(persistedCase=>{
      console.log(persistedCase);
      return HumanTask.findById(req.jwt, persistedCase.activeProcesses[0].id)
    })
    .then(humanTask=>{      
      res.send(humanTask);
    });
});

router.get('/visualvm2', (req, res, next)=>{
  HumanTask.draft(req.jwt, {
    "id": "109jxhtm1kj77",
    "taskParams": [
      {
          "id": "f6dyvtmeushk",
          "values": [{id: "2c940c085e765068015e7704c2540120"}],
          "description": "Patient",
          "name": "GCS2_Patient"
      },
      {        
          "id": "1q3ovio3kjku2",
          "values": [{"id": "2c940c085e765068015e76786adf0070"}],       
          "description": "Owner",         
          "name": "GCS2_Owner"         
      }
    ]
  })
  .then(draftedTask=>{
    res.send(draftedTask);
  });
});

module.exports = router;