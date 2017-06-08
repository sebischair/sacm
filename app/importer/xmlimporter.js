'use strict';
import Promise from 'bluebird';
import request from 'request-promise';
import xml2js from 'xml2js';
import Workspace from '../models/model.workspace';
import UserDefinition from '../models/casedefinition/model.userdefinition';
import User from '../models/case/model.user';
import Group from '../models/casedefinition/model.group';
import EntityDefinition from '../models/casedefinition/model.entitydefinition';
import AttributeDefinition from '../models/casedefinition/model.attributedefinition';
import DerivedAttributeDefinition from '../models/casedefinition/model.derivedattributedefinition';
import CaseDefinition from '../models/casedefinition/model.casedefinition';
import SummarySectionDefinition from '../models/casedefinition/model.summarysectiondefinition';
import StageDefinition from '../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from '../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from '../models/casedefinition/model.automatedtaskdefinition';
import TaskParamDefinition from '../models/casedefinition/model.taskparamdefinition';
import HttpHookDefinition from '../models/casedefinition/model.httphookdefinition';
import SentryDefinition from '../models/casedefinition/model.sentrydefinition';
import Case from '../models/case/model.case';
import HumanTask from '../models/case/model.humantask';
const xml = Promise.promisifyAll(xml2js);
const fs = Promise.promisifyAll(require("fs"));


module.exports = class XMLImporter {

    constructor() {
      this.workspaceMap = new Map();
      this.userAttributeDefinitionMap = new Map();
      this.userMap = new Map(); //<xmlId, sociocortexId>
      this.groupMap = new Map(); //<xmlId, sociocortexId>      
      this.entityDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.attributeDefinitionMap = new Map(); //<xmlEntityId+xmlAttrId, sociocortexId>
      this.derivedAttributeDefinitionMap = new Map(); //<entityName.derAttrName, sociocortexId>
      this.caseDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.stageDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.humanTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.automatedTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
    }

    getWorkspaceIdByXMLId(workspaceXMLId){
      if(workspaceXMLId == null)
        console.error('Workspace Id can not be null!');
      else if(!this.workspaceMap.has(workspaceXMLId))
        console.error('ERROR: Workspace ID "'+workspaceXMLId+'" not found');
      else
        return this.workspaceMap.get(workspaceXMLId);  
    }

    getUserIdByXMLId(userXMLId){
      return new Promise((resolve, reject) =>{
        if(userXMLId == null)
          resolve(null);
        else if(!this.userMap.has(userXMLId))
          reject('ERROR: User ID "'+userXMLId+'" not found');
        else
          resolve(this.userMap.get(userXMLId));
      });     
    }

    getUserAttributeDefinitionIdByXMLId(userAttributeDefinitionXMLId){
      if(userAttributeDefinitionXMLId == null)
        console.error('User attribute definition Id can not be null!');
      else if(!this.userAttributeDefinitionMap.has(userAttributeDefinitionXMLId))
        console.error('ERROR: User attribute definition ID "'+userAttributeDefinitionXMLId+'" not found');
      else
        return this.userAttributeDefinitionMap.get(userAttributeDefinitionXMLId);  
    }

    getGroupIdByXMLId(groupXMLId){
      if(groupXMLId == null)
        console.error('Group Id can not be null!');
      else if(!this.groupMap.has(groupXMLId))
        console.error('ERROR: Group ID "'+groupXMLId+'" not found');
      else
        return this.groupMap.get(groupXMLId);  
    }

    getPrincipalIdByXMLId(principalXMLId){
      if(principalXMLId == null)
          console.error('Principal Id can not be null!');
      else{
        let principalId = null;
        let count = 0;
        if(this.userMap.has(principalXMLId)){
          principalId = this.userMap.get(principalXMLId);
          count++;
        }
        if(this.groupMap.has(principalXMLId)){
          principalId = this.groupMap.get(principalXMLId);
          count++;
        }
        if(count == 1)
          return principalId;
        else
          console.error('ERROR: PrincipalId "'+principalXMLId+'" not found or not unique!');
      }
    }

    getEntityDefinitionIdByXMLId(entityDefinitionXMLId){
      return new Promise((resolve, reject) =>{
        if(entityDefinitionXMLId == null)
          resolve(null);
        else if(!this.entityDefinitionMap.has(entityDefinitionXMLId))
          reject('ERROR: EntityDefintion ID "'+entityDefinitionXMLId+'" not found');
        else
          resolve(this.entityDefinitionMap.get(entityDefinitionXMLId));
      });     
    }

    getEntityDefinitionIdByXMLIdSync(entityDefinitionXMLId){      
      if(entityDefinitionXMLId == null)
        return null;
      if(!this.entityDefinitionMap.has(entityDefinitionXMLId)){
        console.log('EntityDefintion ID "'+entityDefinitionXMLId+'" not found');
        throw new Error('EntityDefintion ID "'+entityDefinitionXMLId+'" not found');
      }else
        return this.entityDefinitionMap.get(entityDefinitionXMLId);     
    }

    getCaseDefinitionIdByXMLId(caseDefinitionXMLId){
      return new Promise((resolve, reject) =>{
        if(caseDefinitionXMLId == null)
          resolve(null);
        else if(!this.caseDefinitionMap.has(caseDefinitionXMLId))
          reject('ERROR: CaseDefinition ID "'+caseDefinitionXMLId+'" not found')
        else
          resolve(this.caseDefinitionMap.get(caseDefinitionXMLId));
      });
    }

    getStageDefinitionIdByXMLId(stageDefinitionXMLId){
      return new Promise((resolve, reject) =>{
        if(stageDefinitionXMLId == null)
          resolve(null);
        else if(!this.stageDefinitionMap.has(stageDefinitionXMLId))
          reject('ERROR: StageDefinition ID "'+stageDefinitionXMLId+'" not found')
        else
          resolve(this.stageDefinitionMap.get(stageDefinitionXMLId));
      });
    }

    getProcessDefinitionIdByXMLId(processDefinitionXMLId){
      return new Promise((resolve, reject) =>{
        if(processDefinitionXMLId == null)
          resolve(null);
        else{
          let processDefinitionId = null;
          let count = 0;
          if(this.stageDefinitionMap.has(processDefinitionXMLId)){
            processDefinitionId = this.stageDefinitionMap.get(processDefinitionXMLId);
            count++;
          }
          if(this.humanTaskDefinitionMap.has(processDefinitionXMLId)){
            processDefinitionId = this.humanTaskDefinitionMap.get(processDefinitionXMLId);
            count++;
          }
          if(this.automatedTaskDefinitionMap.has(processDefinitionXMLId)){
            processDefinitionId = this.automatedTaskDefinitionMap.get(processDefinitionXMLId);
            count++;
          }
          if(count == 1)
            resolve(processDefinitionId);
          else
            reject('ERROR: ProcessDefinition ID "'+processDefinitionXMLId+'" not found or not unique!');
        }
      });
    }

    import(filePath, isExecuteCase){      
      return this.fileExists(filePath)
        .then(exist =>{
          if(!exist)
            throw new Error('File does not exist' + filePath);
          else          
            return xml.parseStringAsync(fs.readFileSync(filePath).toString());
        })
        .then(json=>{
          this.json = json.SACMDefinition;
          return this.initializeMaps();
        })
        .then(()=>{
          return Workspace.deleteAll();
        })
        .then(()=>{
          return this.deleteUserDefinitionAttributeDefinitions();
        })
        .then(()=>{
          return this.createUserDefinition();
        })
        .then(()=>{
          return Group.deleteAll();                  
        })
        .then(()=>{
          return User.deleteAll();  
        })
        .then(()=>{
          return this.createUsers();
        })
        .then(()=>{
          return this.createGroups();
        })
        .then(()=>{
          return this.createMemberships();
        })
        .then(()=>{
          return this.createWorkspaces();
        })     
        .then(() => {
          return this.createCase();
        })      
        .then(caseInstance => {
          if(!isExecuteCase)
            return Promise.resolve(caseInstance);
          else
            return this.completeCase();
        });
    }

    fileExists(filePath) {
      return new Promise((resolve, reject)=>{
        if(fs.existsSync(filePath))
          resolve(true);
        else
          resolve(false)
      });
    }

    initializeMaps(){      
      this.groupMap.set('Allusers', 'allusers'); //All registered users 
      this.groupMap.set('Everybody', 'everybody'); //Everybody
      return User.me()
        .then(me=>{
          this.userMap.set('Me', me.id);
          return Promise.resolve();
        })
    }

    deleteUserDefinitionAttributeDefinitions(){
       return UserDefinition.find()
        .then(userDefinition=>{
          if(userDefinition.attributeDefinitions == null) {
            return Promise.reject();
          }
          return Promise.each(userDefinition.attributeDefinitions, ad=>{
            return AttributeDefinition.deleteById(ad.id);
          });
        });
    }

    createUserDefinition(){
      if(this.json.UserDefinition == null)
        return Promise.resolve();
      const userDefintion = this.json.UserDefinition[0];
      let persistedUserDefinitionId = null;
      return UserDefinition.find()
        .then(persistedUserDef =>{
          persistedUserDefinitionId = persistedUserDef.id;
          return this.createUserDefinitionAttributeDefinitions(userDefintion, persistedUserDefinitionId);
        })/*
        .then(()=>{
          return this.createUserDefinitionDerivedAttributeDefinitions(userDefintion, persistedUserDefinitionId);
        });*/
    }

    createUserDefinitionAttributeDefinitions(UserDefinition, persistedUserDefinitionId){
      if(UserDefinition == null || UserDefinition.AttributeDefinition == null)
        return Promise.resolve();
      return Promise.each(UserDefinition.AttributeDefinition, ad=>{                            
        let data = this.resolveAttributeType(ad.$.type, ad);
        data.name = ad.$.id;
        data.description = ad.$.description;
        data.multiplicity = ad.$.multiplicity; 
        data.entityDefinition = persistedUserDefinitionId;        
        return AttributeDefinition.create(data)             
          .then(persistedAttributeDefinition =>{
            this.userAttributeDefinitionMap.set(ad.$.id, persistedAttributeDefinition.id);
            return Promise.resolve();
          })
          .catch(err=>{
            console.error(err);
            return Promise.reject(err);
          });
      });
    }

    createUserDefinitionDerivedAttributeDefinitions(UserDefinition, persistedUserDefinitionId) {
      if(UserDefinition == null || UserDefinition.DerivedAttributeDefinition == null)  
          return Promise.resolve();
      return Promise.each(UserDefinition.DerivedAttributeDefinition, ad=>{   
          return DerivedAttributeDefinition.create({
            name: ad.$.id,
            description: ad.$.description,
            expression: ad.$.expression,
            entityDefinition: persistedUserDefinitionId
          });   
      }); 
    }

    createUsers(){
      return Promise.each(this.json.User, u=>{      
        const data = {
          name: u.$.id,
          email: u.$.email,
          attributes: []
        }
        if(u.Attribute != null)
          for(let a of u.Attribute){
            data.attributes.push({
              attributeDefinition: {id: this.getUserAttributeDefinitionIdByXMLId(a.$.attributeDefinitionId)},
              name: a.$.attributeDefinitionId,
              values: JSON.parse(a.$.values.replace(/'/g,'"'))
            });
          }          
        return User.createAndVerify(data)
          .then(persistedUser =>{
            this.userMap.set(u.$.id, persistedUser.id);     
            return Promise.resolve();
          })
          .catch(err=>{
            console.error(err);
          })
      });
    }


    createGroups(){
      return Promise.each(this.json.Group, g=>{
        const data = {
          name: g.$.id,
          administrators: []
        }
        if(g.Administrator == null){
          console.error('No administrator defined for group!');
          return Promise.reject('No administrator defined for group!');
        }
        return Promise.each(g.Administrator, a=>{  
            data.administrators.push(this.getPrincipalIdByXMLId(a.$.principalId));
            return Promise.resolve();      
        })
        .then(()=>{
          return Group.create(data)
        })        
        .then(persistedGroup =>{
          this.groupMap.set(g.$.id, persistedGroup.id);
          return Promise.resolve();
        })
        .catch(err=>{
          console.log(err);
          return Promise.reject(err);
        });
        
      }).catch(err=>{
        console.log(err);
        return Promise.reject(err);
      })
    }

    createMemberships(){
      return Promise.each(this.json.Group, g=>{
        if(g.Membership == null)
          return Promise.resolve();
        return Promise.each(g.Membership, m=>{
          const groupId = this.getGroupIdByXMLId(g.$.id);
          const principalId = this.getPrincipalIdByXMLId(m.$.principalId);
          return Group.addMember(groupId, principalId);
        });     
      });
    }

    createWorkspaces(){
      if(this.json.Workspace == null)
        return Promise.resolve();
      return Promise.each(this.json.Workspace, w=>{
        const data = {
          name: w.$.id,
          description: w.$.description,
          permissions:{
            readers: [],
            writers: [],
            administrators: []
          }
        }
        if(w.Reader != null)
          for(let r of w.Reader)
            data.permissions.readers.push(this.getPrincipalIdByXMLId(r.$.principalId));
        if(w.Writer != null)
          for(let r of w.Writer)
            data.permissions.writers.push(this.getPrincipalIdByXMLId(r.$.principalId));
        if(w.Administrator != null)
          for(let a of w.Administrator)
            data.permissions.administrators.push(this.getPrincipalIdByXMLId(a.$.principalId));
        //if(w.$.staticId != null)
        //  data.id = w.$.staticId;
        return Workspace.create(data)
          .then(persistedWorkspace=>{
            this.workspaceMap.set(w.$.id, persistedWorkspace.id);

            /** clean all maps related to workspace elements */
            this.entityDefinitionMap = new Map(); 
            this.attributeDefinitionMap = new Map(); 
            this.derivedAttributeDefinitionMap = new Map(); 
            this.caseDefinitionMap = new Map(); 
            this.stageDefinitionMap = new Map(); 
            this.humanTaskDefinitionMap = new Map(); 
            this.automatedTaskDefinitionMap = new Map(); 

            return this.createWorkspaceElements(w);
          });
      })
      .catch(err=>{
        console.log(err);
        return Promise.reject(err);
      })
    }

    createWorkspaceElements(Workspace){        
      return this.createEntityDefinitions(Workspace)
        .then(() => {
          return this.createAttributeDefinitions(Workspace);
        })
        .then(() => {
          return this.createDerivedAttributeDefinitions(Workspace);
        })
        .then(() => {
          return this.createCaseDefinitions(Workspace);
        })
        .then(() => {
          return this.createStageDefinitions(Workspace);
        })
        .then(() => {
          return this.createTaskDefinitions(Workspace);
        })
        .then(() => {
          return this.createSentryDefinitions(Workspace);
        });
    }

    createEntityDefinitions(Workspace) {
      return Promise.each(Workspace.EntityDefinition, ed=>{
        return EntityDefinition.create(this.getWorkspaceIdByXMLId(Workspace.$.id), ed.$.id)
          .then(persistedEntityDefinition =>{
            this.entityDefinitionMap.set(ed.$.id, persistedEntityDefinition.id);
            return Promise.resolve();
          });
      });
    }

    createAttributeDefinitions(Workspace) {
      if(Workspace.EntityDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.EntityDefinition, ed=>{
        if(ed.AttributeDefinition == null)  
            return Promise.resolve();
        return Promise.each(ed.AttributeDefinition, ad=>{
          return new Promise((resolve, reject)=>{            
            return this.getEntityDefinitionIdByXMLId(ed.$.id)
              .then(entityDefId => {       
                let data = this.resolveAttributeType(ad.$.type, ad);
                data.name = ad.$.id;
                data.description = ad.$.description;
                data.multiplicity = ad.$.multiplicity; 
                data.entityDefinition = entityDefId;        
                return AttributeDefinition.create(data);
              })
              .then(persistedAttributeDefinition =>{
                this.attributeDefinitionMap.set(ed.$.id+ad.$.id, persistedAttributeDefinition.id);
                resolve();
              })
              .catch(err=>{
                reject(err);
              });
          });         
        });
      });
    }

    resolveAttributeType(type, AttributeDefinition){
      /** e.g. {type: 'link', options:{entityDefinition: entityDefinitionId}} */
      let attrDef = {
        attributeType: 'notype',
        options: {}
      };
      if(type == null)
        return attrDef;
      const ref = type.split('.');   
      const validTypes = ['link', 'notype', 'string', 'longtext', 'boolean', 'number', 'enumeration', 'date'];
      if(validTypes.indexOf(ref[0].toLowerCase()) == -1){        
        console.log('Could not resolve attibute type!');
        throw new Error('Could not resolve attibute type!');
      }else{
        attrDef.attributeType = ref[0].toLowerCase();
      }
      if(attrDef.attributeType == 'link'){
        if(ref.length > 2 && ref[1] == 'EntityDefinition'){
          attrDef.options.entityDefinition = {
            id: this.getEntityDefinitionIdByXMLIdSync(ref[2])
          };          
        }

        if(ref.length > 2 && ref[1].toLowerCase() == 'users'){
          attrDef.options = {
            resourceType: 'users',
            groupType: {id: this.getGroupIdByXMLId(ref[2])}          
          };
        }
        /*else if(ref[1] == 'Principals'){
          attrDef.options.entityDefinition = {
            id: this.getEntityDefinitionIdByXMLIdSync(ref[2])
          };    
        }*/
      } 
      if(attrDef.attributeType == 'enumeration'){
        if(AttributeDefinition.EnumerationOption == null){
          console.log('A Enumeration should provide at least one value!');
          throw new Error('A Enumeration should provide at least one value!');
        }else{
          attrDef.options.enumerationValues = []; 
          for(let i=0; i<AttributeDefinition.EnumerationOption.length; i++){
            const option = AttributeDefinition.EnumerationOption[i];
            const data = {
              value: option.$.value,
              description: option.$.description
            }
            attrDef.options.enumerationValues.push(data);
          }          
        }     
      }
      return attrDef;    
    }

    createDerivedAttributeDefinitions(Workspace) {
      return Promise.each(Workspace.EntityDefinition, ed=>{  
        if(ed.DerivedAttributeDefinition == null)  
            return Promise.resolve();
        return Promise.each(ed.DerivedAttributeDefinition, ad=>{                 
          return this.getEntityDefinitionIdByXMLId(ed.$.id)
            .then(entityDefId=>{          
              return DerivedAttributeDefinition.create({
                name: ad.$.id,
                description: ad.$.description,
                expression: ad.$.expression,
                entityDefinition: entityDefId
              });
            })
            .then(persistedAttributeDefinition =>{
              this.derivedAttributeDefinitionMap.set(ed.$.id+ad.$.id, persistedAttributeDefinition.id);
              return Promise.resolve();
            });     
        });
      });
    }
    

    createCaseDefinitions(Workspace) {
      if(Workspace.CaseDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.CaseDefinition, cd=>{
        return this.getEntityDefinitionIdByXMLId(cd.$.entityDefinitionId)
          .then(entityDefinitionId=>{            
            const data = {
              name: cd.$.id,
              description: cd.$.description,
              ownerPath: cd.$.ownerPath,
              entityDefinition: entityDefinitionId
            };
            return CaseDefinition.create(data)
          })
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(cd.$.id, persistedCaseDefinition.id);
            return this.createSummarySectionDefinitions(cd.SummarySectionDefinition, persistedCaseDefinition.id);
          })
          .catch(err=>{
            console.log(err);
            return Promise.reject(err);
          });
      });
    }

    createSummarySectionDefinitions(SummarySectionDefinitions, caseDefinitionId){
      if(SummarySectionDefinitions == null)
        return Promise.resolve();
      return Promise.each(SummarySectionDefinitions, ssd=>{
        if(ssd.SummaryParamDefinition == null)
          return Promise.resolve();
        let data = {
          name: ssd.$.id,
          description: ssd.$.description,
          paths: [],
          caseDefinition: caseDefinitionId
        }
        for(let i=0; i<ssd.SummaryParamDefinition.length; i++){
          const param = ssd.SummaryParamDefinition[i];
          if(param.$.path != null)
            data.paths.push(param.$.path);
        };
        return SummarySectionDefinition.create(data);
      });
    }

    createStageDefinitions(Workspace) {
      if(Workspace.CaseDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.CaseDefinition, cd=>{
        return this.getCaseDefinitionIdByXMLId(cd.$.id)
          .then(caseDefId=>{
            return this.createStageDefinitionRecursive(caseDefId, null, cd.StageDefinition);
          });
      });
    }

    createStageDefinitionRecursive(caseDefId, parentStageDefId, stageDefinitions){
      if(stageDefinitions == null)
        return Promise.resolve();
      return Promise.each(stageDefinitions, sd=>{
        let stageDefinitionId = null;
        return this.getEntityDefinitionIdByXMLId(sd.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: sd.$.id,
              description: sd.$.description,
              isRepeatable: sd.$.isRepeatable,
              isMandatory: sd.$.isMandetory,
              caseDefinition: caseDefId,
              parentStageDefinition: parentStageDefId,              
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: sd.$.entityAttachPath
            }
            return StageDefinition.create(data);
          })
          .then(persistedStageDef=>{
            this.stageDefinitionMap.set(sd.$.id, persistedStageDef.id);
            stageDefinitionId = persistedStageDef.id;
            return this.createStageDefinitionRecursive(caseDefId, persistedStageDef.id, sd.StageDefinition);
          })
          .then(()=>{
            return this.createHttpHookDefinitions(stageDefinitionId, sd.HttpHookDefinition);
          })
          .catch(err=>{
            return Promise.reject(err);
          });
      });
    }

    createTaskDefinitions(Workspace){
      if(Workspace.CaseDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.CaseDefinition, cd=>{
        let caseDefId = null;
        return this.getCaseDefinitionIdByXMLId(cd.$.id)
          .then(caseDefeinitionId=>{
            caseDefId = caseDefeinitionId;
            return this.createHumanTaskDefinitons(caseDefId, null, cd.HumanTaskDefinition);
          })
          .then(()=>{
            return this.createAutomatedTaskDefinitons(caseDefId, null, cd.AutomatedTaskDefinition);
          })
          .then(()=>{
            return this.createTaskDefinitionRecursive(caseDefId, null, cd.StageDefinition);
          });
      });
    }

    createTaskDefinitionRecursive(caseDefId, parentStageDefId, stageDefinitions){
      if(stageDefinitions == null)
        return Promise.resolve();
      return Promise.each(stageDefinitions, sd=>{
        let parentStageDefId = null;
        return this.getStageDefinitionIdByXMLId(sd.$.id)
          .then(parentStageDefinitionId=>{
            parentStageDefId = parentStageDefinitionId;
            return this.createTaskDefinitionRecursive(caseDefId, parentStageDefId, sd.StageDefinition)
          })
          .then(()=>{
            return this.createHumanTaskDefinitons(caseDefId, parentStageDefId, sd.HumanTaskDefinition)
          })
          .then(()=>{
            return this.createAutomatedTaskDefinitons(caseDefId, parentStageDefId, sd.AutomatedTaskDefinition)
          });
      });
    }

    createHumanTaskDefinitons(caseDefId, parentStageDefId, humanTaskDefinitions){
      if(humanTaskDefinitions == null)
        return Promise.resolve();
      return Promise.each(humanTaskDefinitions, td=>{
        let humanTaskDefinitionId = null;
        return this.getEntityDefinitionIdByXMLId(td.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: td.$.id,
              description: td.$.description,          
              ownerPath: td.$.ownerPath,
              isRepeatable: td.$.isRepeatable,
              isMandatory: td.$.isMandetory,
              caseDefinition: caseDefId,          
              parentStageDefinition: parentStageDefId,                  
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: td.$.entityAttachPath
            }            
            return HumanTaskDefinition.create(data)
          })
          .then(persistedHumanTaskDef=>{
            this.humanTaskDefinitionMap.set(td.$.id, persistedHumanTaskDef.id);
            humanTaskDefinitionId = persistedHumanTaskDef.id;
            return this.createTaskParamDefinitions(persistedHumanTaskDef.id, td.TaskParamDefinition);
          })
          .then(()=>{
            return this.createHttpHookDefinitions(humanTaskDefinitionId, td.HttpHookDefinition);
          })
          .then(()=>{
            return Promise.resolve();
          })
          .catch(err=>{
            console.log(err)
            return Promise.reject(err);
          });
      });
    }

    createAutomatedTaskDefinitons(caseDefId, parentStageDefId, automatedTaskDefinitions){
      if(automatedTaskDefinitions == null)
        return Promise.resolve();
      return Promise.each(automatedTaskDefinitions, td=>{        
        let automatedTaskDefinitionId = null;
        return this.getEntityDefinitionIdByXMLId(td.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: td.$.id,
              description: td.$.description,
              isRepeatable: td.$.isRepeatable,
              isMandatory: td.$.isMandetory,
              caseDefinition: caseDefId,
              parentStageDefinition: parentStageDefId,           
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: td.$.entityAttachPath
            }     
            return AutomatedTaskDefinition.create(data)
          })
          .then(persistedAutomatedTaskDef=>{
            this.automatedTaskDefinitionMap.set(td.$.id, persistedAutomatedTaskDef.id);
            automatedTaskDefinitionId = persistedAutomatedTaskDef.id;
            return this.createTaskParamDefinitions(persistedAutomatedTaskDef.id, td.TaskParamDefinition);
          })
          .then(()=>{
            return this.createHttpHookDefinitions(automatedTaskDefinitionId, td.HttpHookDefinition);
          })
          .then(()=>{
            return Promise.resolve();
          })
          .catch(err=>{
            return Promise.reject(err);
          });
      });
    }

    createTaskParamDefinitions(taskDefinitionId, taskDefinitionParams){
      if(taskDefinitionParams == null)
        return Promise.resolve();
      return Promise.each(taskDefinitionParams, tp=>{
        const data = {
          path: tp.$.path,
          isReadOnly: tp.$.isReadOnly,
          taskDefinition: taskDefinitionId
        }
        return TaskParamDefinition.create(data);
      });
    }

    createHttpHookDefinitions(processDefinitionId, httpHookDefinitions){      
      return new Promise((resolve, reject)=>{
        if(httpHookDefinitions == null)
          return resolve();
        Promise.each(httpHookDefinitions, hhd=>{
          const data = {
            on: hhd.$.on,
            url: hhd.$.url,
            method: hhd.$.method,
            processDefinition: processDefinitionId
          }
          return HttpHookDefinition.create(data);
        })
        .then(()=>{
          resolve()
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        });
      });

    }

    createSentryDefinitions(Workspace){
      if(Workspace.CaseDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.CaseDefinition, cd=>{
        return this.createSentryDefinitionsRecursive(cd.StageDefinition)
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(cd.StageDefinition);
          })
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(cd.HumanTaskDefinition)
          })
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(cd.AutomatedTaskDefinition);
          });
      });
    }

    createSentryDefinitionsRecursive(stageDefinitions){
      if(stageDefinitions == null)
        return Promise.resolve();
      return Promise.each(stageDefinitions, sd=>{
        return this.createSentryDefinitionsRecursive(sd.StageDefinition)
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(sd.StageDefinition);
          })
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(sd.HumanTaskDefinition)
          })
          .then(()=>{
            return this.createSentryDefinitionOfProcesses(sd.AutomatedTaskDefinition);
          });
      });
    }

    createSentryDefinitionOfProcesses(processDefinitions){
      if(processDefinitions == null)
        return Promise.resolve();
      return Promise.each(processDefinitions, pd=>{
        if(pd.SentryDefinition == null){
          return Promise.resolve();
        }else{
          return this.getProcessDefinitionIdByXMLId(pd.$.id)
            .then(processDefinitionId=>{
              return this.createSentryDefinition(processDefinitionId, pd.SentryDefinition);
            });
        }
      })
    }

    createSentryDefinition(enablesProcessDefinitionId, sentryDefinitions){
      if(sentryDefinitions == null)
        return Promise.resolve();
      return Promise.each(sentryDefinitions, sd=>{
        const data = {
          enablesProcessDefinition: enablesProcessDefinitionId,
          completedProcessDefinitions: [],
          expression: null
        };
        return Promise.each(sd.precondition, p=>{
          if(p.$.processDefinitionId != null){
            return this.getProcessDefinitionIdByXMLId(p.$.processDefinitionId)
              .then(processDefinitionId=>{
                data.completedProcessDefinitions.push({id: processDefinitionId});
                return Promise.resolve();
              });
          }else if(p.$.expression != null){
            data.expression = p.$.expression.replace(/'/g,'"');
            return Promise.resolve();
          }
        })
        .then(()=>{
          return SentryDefinition.create(data);
        });
      });
    }

    createCase(){
      const caseDefinitionId = this.caseDefinitionMap.values().next().value;
      return Case.create({caseDefinition: caseDefinitionId})
        .then(case1=>{
          this.case1 = case1;
          return Case.findTreeById(case1.id);
        });
    }

    completeCase(){      
      const caseId = this.case1.id;
      return this.completeHumanTaskWithName(caseId, 'Lace', {
        lace1: ['2'],
        lace2: ['0']
      })
      .then(()=>{
        return this.completeHumanTaskWithName(caseId, 'Barthel', {
          barthel1: ['10'],
          barthel2: ['5']
        });
      })
      .then(()=>{
        return this.completeHumanTaskWithName(caseId, 'PhysicalActivityPrescription', {
          phactp1: ['v1'],
          phactp2: ['v2']
        });
      })
      .then(()=>{
        return this.completeHumanTaskWithName(caseId, 'DischageForm', {
          reason: ['some reason'],
          date: ['some date']
        });
      })      
      .then(()=>{
        console.log(this.userMap);
        return Case.findTreeById(caseId);
      })
      .catch(err=>{
        console.log(err);
      })        
    }

   
    /**
     * @param caseId 
     * @param taskName 
     * @param paramsMap {attrName1:[value1, value2], attrName2: [value1, value2]}
     */
    completeHumanTaskWithName(caseId, taskName, paramsMap){     
       return HumanTask.findAllByCaseId(caseId)
        .then(humanTasks=>{          
          const ht = this.findProcessWithName(humanTasks, taskName);
          return HumanTask.findById(ht.id);
        })        
        .then(humanTask=>{
          for(let i=0; i<humanTask.taskParams.length; i++){
            let tp = humanTask.taskParams[i];
            if(paramsMap.hasOwnProperty(tp.name))
              humanTask.taskParams[i].values = paramsMap[tp.name];            
          }
          return HumanTask.complete(humanTask);
        });        
    }

    findProcessWithName(nestedProcesses, searchedName){
      for(let process of nestedProcesses)     
        for(let instance of process)
          if(instance.name == searchedName)
            return instance;
      return null;
    }

}
