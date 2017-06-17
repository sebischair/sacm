import express from 'express';
var router = express.Router();
import Promise from 'bluebird';
import Workspace from '../models/model.workspace';
import UserDefinition from '../models/group/model.userdefinition';
import User from '../models/group/model.user';
import Group from '../models/group/model.group';
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

  let workspace = null;  
  let rootEntityDefinition = null;
  let caseDefinition = null;
  let stageDefinitioIdentification = null;
  let humanTaskDefinitionIdentification = null;

  let case2 = null;

  return Workspace.deleteAll()
    .then(()=>{
      return Workspace.create({
        name: 'Testworkspace'
      });        
    })
    .then(persistedWorkspace=>{
      workspace = persistedWorkspace;
      return EntityDefinition.create2({
        workspace: workspace.id,
        name: 'RootEntityDefinition',
        namePlural: 'Root Entity Definition'
      });
    })
    .then(persistedRootEntityDefinition=>{
      rootEntityDefinition = persistedRootEntityDefinition;
      return CaseDefinition.create({
        name: 'DemoCase',
        description: 'Demo Case',
        summaryPaths: [],
        entityDefinition: rootEntityDefinition.id
      });
    })
    .then(persistedCaseDefinition =>{      
      caseDefinition = persistedCaseDefinition;
      return StageDefinition.create({
        name: 'IdentificationStage',
        description: 'Identifictation Stage',
        isRepeatable: false,
        isMandatory: true,
        caseDefinition: caseDefinition.id,
        parentStageDefinition: null,              
        newEntityDefinition: null,
        newEntityAttachPath: null
      });
    })
    .then(persistedStageDefinition=>{
      stageDefinitioIdentification = persistedStageDefinition;
      return HumanTaskDefinition.create({
        name: 'IdentificationTask',
        description: 'Identification Task',          
        ownerPath: null,
        isRepeatable: false,
        isMandatory: true,
        caseDefinition: caseDefinition.id,          
        parentStageDefinition: null,                  
        newEntityDefinition: null,
        newEntityAttachPath: null         
      });
    })
    .then(persistedHumanTaskDefinition=>{
      humanTaskDefinitionIdentification = persistedHumanTaskDefinition;
      return Promise.resolve();
    })
    .then(()=>{
      return Case.create({
        caseDefinition: caseDefinition.id
      });
    })
    .then(persistedCase=>{
      case2 = persistedCase;
      return Case.findTreebyId(case2.id)
    })
    .then(caseTree=>{
      console.log(JSON.stringify(caseTree,null,2));
      return Promise.resolve(caseTree);
    });
  
});

module.exports = router;