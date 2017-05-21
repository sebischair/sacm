import express from 'express';
var router = express.Router();
import Promise from 'bluebird';
import Workspace from '../models/model.workspace';
import UserDefinition from '../models/casedefinition/model.userdefinition';
import User from '../models/case/model.user';
import Group from '../models/casedefinition/model.group';
import EntityDefinition from '../models/casedefinition/model.entitydefinition';
import AttributeDefinition from '../models/casedefinition/model.attributedefinition';
import DerivedAttributeDefinition from '../models/casedefinition/model.derivedattributedefinition';
import CaseDefinition from '../models/casedefinition/model.casedefinition';
import StageDefinition from '../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from '../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from '../models/casedefinition/model.automatedtaskdefinition';
import TaskParamDefinition from '../models/casedefinition/model.taskparamdefinition';
import HttpHookDefinition from '../models/casedefinition/model.httphookdefinition';
import SentryDefinition from '../models/casedefinition/model.sentrydefinition';
import Case from '../models/case/model.case';
import HumanTask from '../models/case/model.humantask';

router.get('/', (req, res, next)=>{
  console.log('test')
  let workspace = null;

  return Workspace.deleteAll()
    .then(()=>{
      return Workspace.create({
        name: 'Testworkspace'
      });        
    })
    .then(persistedWorkspace=>{
      workspace = persistedWorkspace;
      console.log('testworkspace')
    })
  
});

module.exports = router;