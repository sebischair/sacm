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
      this.workspaceName = 'connecare2017';
      this.workspaceId = null;      
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

    import(filePath){      
      return this.fileExists(filePath)
        .then(exist =>{
          if(!exist)
            throw new Error('File does not exist' + filePath);
          else          
            return xml.parseStringAsync(fs.readFileSync(filePath).toString());
        })
        .then(json=>{
          this.json = json.SACMDefinition;
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
          return Workspace.create(this.workspaceName);
        })
        .then(workspace => {
          this.workspaceId = workspace.id;          
          return this.createEntityDefinitions();
        })
        .then(() => {
          return this.createAttributeDefinitions();
        })
        .then(() => {
          return this.createDerivedAttributeDefinitions();
        })
        .then(() => {
          return this.createCaseDefinitions();
        })
        .then(() => {
          return this.createStageDefinitions();
        })
        .then(() => {
          return this.createTaskDefinitions();
        })
        .then(() => {
          return this.createSentryDefinitions();
        })
        .then(() => {
          return this.createCase();
        })/*
        .then(() => {
          return this.completeTask();
        });*/
    }

    fileExists(filePath) {
      return new Promise((resolve, reject)=>{
        if(fs.existsSync(filePath))
          resolve(true);
        else
          resolve(false)
      });
    }

    deleteUserDefinitionAttributeDefinitions(){
       return UserDefinition.find()
        .then(userDefinition=>{
          if(userDefinition.attributeDefinitions == null) {
            console.log('hiererer');
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
      return UserDefinition.find()
        .then(persistedUserDefinition =>{
          if(userDefintion != null && userDefintion.AttributeDefinition != null){
            const attributeDefinitions = userDefintion.AttributeDefinition;
            return Promise.each(attributeDefinitions, ad=>{                            
              let data = this.resolveAttributeType(ad.$.type, ad);
              data.name = ad.$.id;
              data.description = ad.$.description;
              data.multiplicity = ad.$.multiplicity; 
              data.entityDefinition = persistedUserDefinition.id;        
              return AttributeDefinition.create(data)             
                .then(persistedAttributeDefinition =>{
                  return Promise.resolve();
                })
                .catch(err=>{
                  console.error(err);
                  return Promise.reject(err);
                });
            });
          }else{
            return Promise.resolve();
          }
        });
    }

    createUsers(){
      return Promise.each(this.json.User, u=>{
        const data = {
          name: u.$.id,
          email: u.$.email,
        }
        return User.create(data)
          .then(persistedUser =>{
            console.log(persistedUser)
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
          return this.getUserIdByXMLId(a.$.principalId)
            .then(userId=>{
              data.administrators.push(userId);
              return Promise.resolve();
            })
            .catch(err=>{
              console.error(err);
              return Promise.reject(err);
            });        
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

    createEntityDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
        return EntityDefinition.create(this.workspaceId, ed.$.id)
          .then(persistedEntityDefinition =>{
            this.entityDefinitionMap.set(ed.$.id, persistedEntityDefinition.id);
            return Promise.resolve();
          });
      });
    }

    createAttributeDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
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

    createDerivedAttributeDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{  
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
    

    createCaseDefinitions() {
      return Promise.each(this.json.CaseDefinition, cd=>{
        return this.getEntityDefinitionIdByXMLId(cd.$.entityDefinitionId)
          .then(entityDefinitionId=>{            
            const data = {
              name: cd.$.id,
              description: cd.$.description,
              ownerPath: cd.$.ownerPath,
              entityDefinition: entityDefinitionId,
              summaryPaths: this.getSummaryDefinitionParam(cd)
            };
            return CaseDefinition.create(data)
          })
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(cd.$.id, persistedCaseDefinition.id);
            return Promise.resolve();
          })
          .catch(err=>{
            console.log(err);
            return Promise.reject(err);
          });
      });
    }

    getSummaryDefinitionParam(CaseDefinition){
      if(CaseDefinition.SummaryDefinitionParam == null)
        return [];
      let params = [];
      for(let i=0; i<CaseDefinition.SummaryDefinitionParam.length; i++){
        const param = CaseDefinition.SummaryDefinitionParam[i];
        if(param.$.path != null)
          params.push(param.$.path);
      };
      return params;
    }

    createStageDefinitions() {
      return Promise.each(this.json.CaseDefinition, cd=>{
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

    createTaskDefinitions(){
      return Promise.each(this.json.CaseDefinition, cd=>{
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
        console.log('here');
        let humanTaskDefinitionId = null;
        return this.getEntityDefinitionIdByXMLId(td.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            console.log('here2')
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
        const data = {
          name: td.$.id,
          description: td.$.description,
          isRepeatable: td.$.isRepeatable,
          isMandatory: td.$.isMandetory,
          caseDefinition: caseDefId,
          parentStageDefinition: parentStageDefId
        }          
        let automatedTaskDefinitionId = null;
        return AutomatedTaskDefinition.create(data)
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

    createSentryDefinitions(){
      return Promise.each(this.json.CaseDefinition, cd=>{
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
          completedProcessDefinitions: []
        };
        return Promise.each(sd.precondition, p=>{
            return this.getProcessDefinitionIdByXMLId(p.$.processDefinitionId)
              .then(processDefinitionId=>{
                data.completedProcessDefinitions.push({id: processDefinitionId});
                return Promise.resolve();
              });
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
          return Case.findTreebyId(case1.id);
        });
    }

    completeTask(){
      console.log(this.humanTaskDefinitionMap);
      let t5Id = this.humanTaskDefinitionMap.get('t5');
      return HumanTask.findByHumanTaskDefinitionId(t5Id)
        .then(humanTasks=>{
          console.log(JSON.stringify(humanTasks, null, 2));
          const humanTask = humanTasks[0];
          humanTask.taskParams[0].values.push("Hello3");
          return HumanTask.complete(humanTask);
        })
        .then((humanTask)=>{
          console.log(JSON.stringify(humanTask, null, 2));
          return Promise.resolve(humanTask);
        })
        .catch(err=>{
          console.log(err);
        })
    }

}
