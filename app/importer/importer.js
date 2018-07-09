'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import colors from 'colors';
import xml2js from 'xml2js';
import prompt from 'prompt-promise';
import Workspace from '../models/workspace/model.workspace';
import UserDefinition from '../models/group/model.userdefinition';
import User from '../models/group/model.user';
import Group from '../models/group/model.group';
import EntityDefinition from '../models/datadefinition/model.entitydefinition';
import AttributeDefinition from '../models/datadefinition/model.attributedefinition';
import DerivedAttributeDefinition from '../models/datadefinition/model.derivedattributedefinition';
import CaseDefinition from '../models/casedefinition/model.casedefinition';
import SummarySectionDefinition from '../models/casedefinition/model.summarysectiondefinition';
import StageDefinition from '../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from '../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from '../models/casedefinition/model.automatedtaskdefinition';
import DualTaskDefinition from './../models/casedefinition/model.dualtaskdefinition';
import TaskParamDefinition from '../models/casedefinition/model.taskparamdefinition';
import HttpHookDefinition from '../models/casedefinition/model.httphookdefinition';
import SentryDefinition from '../models/casedefinition/model.sentrydefinition';
import Case from '../models/case/model.case';
import Stage from '../models/case/model.stage';
import HumanTask from '../models/case/model.humantask';
import AutomatedTask from '../models/case/model.automatedtask';
import DualTask from '../models/case/model.dualtask';
import Process from '../models/case/model.process';
import Alert from '../models/case/model.alert';
import Settings from '../models/settings/model.settings';
import config from '../../config';
const xml2jspromise = Promise.promisifyAll(xml2js);
const fs = Promise.promisifyAll(require("fs"));


module.exports = class Importer {

    constructor() {
      this.version = null;
      this.jwt = null; //"Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv"; // Max Mustermann
      this.executionJwt = null; // used to create a case and execute it.
      this.workspaceMap = new Map();
      this.userAttributeDefinitionMap = new Map();
      this.userMap = new Map(); //<xmlId, sociocortexId>
      this.groupMap = new Map(); //<xmlId, sociocortexId> 
      this.groupMap.set('Administrators', 'administrators');     
      this.entityDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.attributeDefinitionMap = new Map(); //<xmlEntityId+xmlAttrId, sociocortexId>
      this.derivedAttributeDefinitionMap = new Map(); //<entityName.derAttrName, sociocortexId>
      this.caseDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.stageDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.humanTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.automatedTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.dualTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
    }

    getWorkspaceIdByXMLId(workspaceXMLId){
      if(workspaceXMLId == null)
        winston.error('Workspace Id can not be null!');
      else if(!this.workspaceMap.has(workspaceXMLId))
        winston.error('ERROR: Workspace ID "'+workspaceXMLId+'" not found');
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

    getUserIdByXMLIdSync(userXMLId){
        if(userXMLId == null)
          return null
        else if(!this.userMap.has(userXMLId)){
          winston.error('ERROR: User ID "'+userXMLId+'" not found');
          return new Error('ERROR: User ID "'+userXMLId+'" not found');
        }else
          return this.userMap.get(userXMLId);  
    }

    getUserAttributeDefinitionIdByXMLId(userAttributeDefinitionXMLId){
      if(userAttributeDefinitionXMLId == null)
        winston.error('User attribute definition Id can not be null!');
      else if(!this.userAttributeDefinitionMap.has(userAttributeDefinitionXMLId))
        winston.error('ERROR: User attribute definition ID "'+userAttributeDefinitionXMLId+'" not found');
      else
        return this.userAttributeDefinitionMap.get(userAttributeDefinitionXMLId);  
    }

    getGroupIdByXMLId(groupXMLId){
      if(groupXMLId == null)
        winston.error('Group Id can not be null!');
      else if(!this.groupMap.has(groupXMLId))
        winston.error('ERROR: Group ID "'+groupXMLId+'" not found');
      else
        return this.groupMap.get(groupXMLId);  
    }

    isGroupByXMLId(groupXMLId){
      if(groupXMLId == null)
        winston.error('Group Id can not be null!');
      else 
        return this.groupMap.has(groupXMLId);
    }

    getPrincipalIdByXMLId(principalXMLId){
      if(principalXMLId == null)
        winston.error('Principal Id can not be null!');
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
          winston.error('ERROR: PrincipalId "'+principalXMLId+'" not found or not unique! Found count: '+count);
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
        winston.error('EntityDefintion ID "'+entityDefinitionXMLId+'" not found');
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
          if(this.dualTaskDefinitionMap.has(processDefinitionXMLId)){
            processDefinitionId = this.dualTaskDefinitionMap.get(processDefinitionXMLId);
            count++;
          }
          if(count == 1)
            resolve(processDefinitionId);
          else
            reject('ERROR: ProcessDefinition ID "'+processDefinitionXMLId+'" not found or not unique!');
        }
      });
    }

    parseXMLFile(localFile){
      let path = 'app/importer/';
      let filePath = path+localFile;
      return this.fileExists(filePath)
      .then(exist =>{
        if(!exist)
          throw new Error('File does not exist' + filePath);
        else {  
          return xml2jspromise.parseStringAsync(fs.readFileSync(filePath).toString(), {explicitChildren:true, preserveChildrenOrder:true});
        }
      })
      .catch(err=>{
        winston.error(err);
        return Promise.reject(err);
      })
    }

    parseXMLString(xmlString){
      return xml2jspromise.parseStringAsync(xmlString, {explicitChildren:true, preserveChildrenOrder:true});
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
      return User.me(this.jwt)
        .then(me=>{
          this.userMap.set('Me', me.id);
          return Promise.resolve();
        })
    }

    addVersion(name){
      if(this.version != null)
        return name+'_v'+this.version
      else
        return name;
    }

    deleteUserDefinitionAttributeDefinitions(){
      let userDefinition = null;
      return UserDefinition.find(this.jwt)
        .then(userDef=>{
          userDefinition = userDef;
          if(userDefinition.derivedAttributeDefinitions == null) {
            return Promise.resolve();
          }
          return Promise.each(userDefinition.derivedAttributeDefinitions, ad=>{
            return DerivedAttributeDefinition.deleteById(this.jwt, ad.id);
          });
        })
        .then(()=>{
          if(userDefinition.attributeDefinitions == null) {
            return Promise.resolve();
          }
          return Promise.each(userDefinition.attributeDefinitions, ad=>{
            return AttributeDefinition.deleteById(this.jwt, ad.id);
          });
        })
    }

    createUserDefinition(){
      if(this.json.UserDefinition == null)
        return Promise.resolve();
      const userDefinition = this.json.UserDefinition[0];
      let persistedUserDefinitionId = null;
      return UserDefinition.find(this.jwt)
        .then(persistedUserDef => {
          return EntityDefinition.update(this.jwt, {id: persistedUserDef.id, allowFreeAttributes: false})
        })
        .then(persistedUserDef =>{
          persistedUserDefinitionId = persistedUserDef.id;
          return this.createUserDefinitionAttributeDefinitions(userDefinition, persistedUserDefinitionId);
        })
        .then(()=>{
          return this.createUserDefinitionDerivedAttributeDefinitions(userDefinition, persistedUserDefinitionId);
        });
    }

    createUserDefinitionAttributeDefinitions(UserDefinition, persistedUserDefinitionId){
      if(UserDefinition == null || UserDefinition.AttributeDefinition == null)
        return Promise.resolve();
      return Promise.each(UserDefinition.AttributeDefinition, ad=>{                            
        let data = this.resolveAttributeType(ad.$.type, ad);
        data.name = ad.$.id;
        data.description = ad.$.description;
        data.additionalDescription = ad.$.additionalDescription;
        data.multiplicity = ad.$.multiplicity; 
        data.entityDefinition = persistedUserDefinitionId;  
        data.uiReference = ad.$.uiReference;   
        data.externalId = ad.$.externalId;      
        return AttributeDefinition.create(this.jwt, data)             
          .then(persistedAttributeDefinition =>{
            this.userAttributeDefinitionMap.set(ad.$.id, persistedAttributeDefinition.id);
            return Promise.resolve();
          })
          .catch(err=>{
            winston.error(err);
            return Promise.reject(err);
          });
      });
    }

    createUserDefinitionDerivedAttributeDefinitions(UserDefinition, persistedUserDefinitionId) {
      if(UserDefinition == null || UserDefinition.DerivedAttributeDefinition == null)  
          return Promise.resolve();
      return Promise.each(UserDefinition.DerivedAttributeDefinition, ad=>{   
          return DerivedAttributeDefinition.create(this.jwt, {
            name: ad.$.id,
            description: ad.$.description,
            additionalDescription: ad.$.additionalDescription,
            expression: ad.$.expression,
            entityDefinition: persistedUserDefinitionId,
            uiReference: ad.$.uiReference,
            externalId: ad.$.externalId
          });   
      }); 
    }

    createUsers(){      
      return Promise.each(this.json.User, u=>{      
        const data = {
          name: u.$.name,
          email: u.$.email,
          password: config.sociocortex.defaultPassword,
          passwordAgain: config.sociocortex.defaultPassword,
          attributes: []
        }
        if(u.$.staticId != null)
          data.id = u.$.staticId;
        if(u.Attribute != null)
          for(let a of u.Attribute){
            data.attributes.push({
              attributeDefinition: {id: this.getUserAttributeDefinitionIdByXMLId(a.$.attributeDefinitionId)},
              name: a.$.attributeDefinitionId,
              values: JSON.parse(a.$.values.replace(/'/g,'"'))
            });
          }          
        return User.createAndVerify(this.jwt, data)
          .then(persistedUser =>{
            this.userMap.set(u.$.id, persistedUser.id);     
            return Promise.resolve();
          })
          .catch(err=>{
            winston.error(err);
          })
      });
    }

    createGroups(){
      let groupsWithDependency = [];
      let groupsWithoutDependency = [];
      if(this.json.Group != null)
        this.json.Group.forEach(g=>{
          let isDependent = false;
          if(g.Administrator != null)
            g.Administrator.forEach(a=>{            
              if(this.isGroupByXMLId(a.$.principalId))
                isDependent = true;
            });
          if(isDependent){
            groupsWithDependency.push(g);
          }else{
            groupsWithoutDependency.push(g);
          }
        });
      let orderedGroups = groupsWithoutDependency.concat(groupsWithDependency);
      return Promise.each(orderedGroups, g=>{
        const data = {
          name: g.$.name,
          description: g.$.description,
          administrators: []
        }
        if(g.$.staticId != null)
          data.id = g.$.staticId;
        if(g.Administrator == null){
          winston.error('No administrator defined for group!');
          return Promise.reject('No administrator defined for group!');
        }
        return Promise.each(g.Administrator, a=>{  
            data.administrators.push(this.getPrincipalIdByXMLId(a.$.principalId));
            return Promise.resolve();      
        })
        .then(()=>{
          return Group.create(this.jwt, data)
        })        
        .then(persistedGroup =>{
          this.groupMap.set(g.$.id, persistedGroup.id);
          return Promise.resolve();
        })
        .catch(err=>{
          winston.error(err);
          return Promise.reject(err);
        });
        
      }).catch(err=>{
        winston.error(err);
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
          return Group.addMember(this.jwt, groupId, principalId);
        });     
      });
    }

    createAdminMemberships(){
      if(this.json.Administrator == null)
        return Promise.resolve();
      return Promise.each(this.json.Administrator, a=>{
        if(a.Membership == null)
          return Promise.resolve();
        return Promise.each(a.Membership, m=>{
          const groupId = this.getGroupIdByXMLId('Administrators');
          const principalId = this.getPrincipalIdByXMLId(m.$.principalId);
          return Group.addMember(this.jwt, groupId, principalId);
        });     
      });
    }

    updateSettings(){
      if(this.json.Settings == null)
        return Promise.resolve();
      const s = this.json.Settings[0];
      let data = {};
      if(s.$.mayEditUserDefinition != null){
        data.mayEditUserDefinition = [];
        let principals = JSON.parse(s.$.mayEditUserDefinition.replace(/'/g,'"'));
        for(let i = 0; i<principals.length; i++)
          data.mayEditUserDefinition.push(this.getPrincipalIdByXMLId(principals[i]));   
      }
      //TODO add other settings parameter
      return Settings.update(this.jwt, data);
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
            contributors: [],
            administrators: [],
            clients: []
          }
        }
        if(w.Reader != null)
          for(let r of w.Reader)
            data.permissions.readers.push(this.getPrincipalIdByXMLId(r.$.principalId));
        if(w.Writer != null)
          for(let r of w.Writer)
            data.permissions.writers.push(this.getPrincipalIdByXMLId(r.$.principalId));
        if(w.Contributor != null)
          for(let r of w.Contributor)
            data.permissions.contributors.push(this.getPrincipalIdByXMLId(r.$.principalId));
        if(w.Administrator != null)
          for(let a of w.Administrator)
            data.permissions.administrators.push(this.getPrincipalIdByXMLId(a.$.principalId));
        if(w.Client != null)
          for(let a of w.Client)
            data.permissions.clients.push(this.getPrincipalIdByXMLId(a.$.principalId));
        if(w.$.staticId != null)
          data.id = w.$.staticId;
        return Workspace.create(this.jwt, data)
          .then(persistedWorkspace=>{
            this.workspaceMap.set(w.$.id, persistedWorkspace.id);
            return Promise.resolve(persistedWorkspace);
          });
      })
      .catch(err=>{
        winston.error(err);
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
        })
        .then(() => {
          return this.setCaseDefinitionAsInstantiable();
        });
    }

    createEntityDefinitions(Workspace) {
      if(Workspace.EntityDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.EntityDefinition, ed=>{
        return EntityDefinition.create(this.jwt, {
            workspace: this.getWorkspaceIdByXMLId(Workspace.$.id), 
            name: this.addVersion(ed.$.id),
            description: ed.$.description,
            allowFreeAttributes: false
          })
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
                data.additionalDescription = ad.$.additionalDescription;
                data.multiplicity = ad.$.multiplicity; 
                data.entityDefinition = entityDefId;   
                data.uiReference = ad.$.uiReference;  
                if(ad.$.uiConstraint != null)
                  data.uiConstraint = JSON.parse(ad.$.uiConstraint.replace(/'/g,'"')); 
                data.externalId = ad.$.externalId;   
                return AttributeDefinition.create(this.jwt, data);
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
      /** e.g. {type: 'link', attributeTypeConstraints:{entityDefinition: entityDefinitionId}} */
      let attrDef = {
        attributeType: 'notype',
        attributeTypeConstraints: {}
      };
      if(type == null)
        return attrDef;
      if(AttributeDefinition.$.defaultValues != null)
        attrDef.defaultValues = JSON.parse(AttributeDefinition.$.defaultValues.replace(/'/g,'"'));      
      if(AttributeDefinition.$.defaultValue != null){
        attrDef.defaultValues = [];
        attrDef.defaultValues.push(AttributeDefinition.$.defaultValue.replace(/'/g,'"'));  
      }  
      const ref = type.split('.');   
      const validTypes = ['link', 'notype', 'string', 'longtext', 'boolean', 'number', 'enumeration', 'date', 'json'];
      if(validTypes.indexOf(ref[0].toLowerCase()) == -1){        
        winston.error('Could not resolve attribute "'+type+'" type!');
        throw new Error('Could not resolve attribute type!');
      }else{
        attrDef.attributeType = ref[0].toLowerCase();
      }
      if(attrDef.attributeType == 'date'){
        for(let i=1; i<ref.length; i++){
          if(ref[i].startsWith('before('))            
            attrDef.attributeTypeConstraints.beforeDate = ref[i].replace('before(','').replace(')','');
          if(ref[i].startsWith('after('))
            attrDef.attributeTypeConstraints.afterDate = ref[i].replace('after(','').replace(')','');
        }
      }
      if(attrDef.attributeType == 'number'){
        for(let i=1; i<ref.length; i++){
          if(ref[i].startsWith('min('))            
            attrDef.attributeTypeConstraints.minValue = ref[i].replace('min(','').replace(')','');
          if(ref[i].startsWith('max('))
            attrDef.attributeTypeConstraints.maxValue = ref[i].replace('max(','').replace(')','');
        }
      }
      if(attrDef.attributeType == 'link'){
        if(ref.length > 2 && ref[1] == 'EntityDefinition'){
          attrDef.attributeTypeConstraints.entityDefinition = {
            id: this.getEntityDefinitionIdByXMLIdSync(ref[2])
          };          
        }

        if(ref.length > 1 && ref[1].startsWith('Users')){ 
          let groups = [];
          if(ref[1].startsWith('Users(')){
            let parsedGroups = ref[1].replace('Users(', '').replace(')', '').split(',');
            parsedGroups.forEach(g=>{      
              groups.push({id: this.getGroupIdByXMLId(g.trim())});
            });
          }         
          attrDef.attributeTypeConstraints = {
            resourceType: 'users',
            groupType: groups        
          };     
        }
      } 
      if(attrDef.attributeType == 'enumeration'){
        if(AttributeDefinition.EnumerationOption == null){
          winston.error('A Enumeration should provide at least one value!');
          throw new Error('A Enumeration should provide at least one value!');
        }else{
          attrDef.attributeTypeConstraints.enumerationValues = []; 
          for(let i=0; i<AttributeDefinition.EnumerationOption.length; i++){
            const option = AttributeDefinition.EnumerationOption[i];
            const data = {
              value: option.$.value,
              description: option.$.description,
              additionalDescription: option.$.additionalDescription,
              externalId: option.$.externalId
            }
            attrDef.attributeTypeConstraints.enumerationValues.push(data);
          }          
        }     
      }
      return attrDef;    
    }

    createDerivedAttributeDefinitions(Workspace) {
      if(Workspace.EntityDefinition == null)
        return Promise.resolve();
      return Promise.each(Workspace.EntityDefinition, ed=>{  
        if(ed.DerivedAttributeDefinition == null)  
            return Promise.resolve();
        return Promise.each(ed.DerivedAttributeDefinition, ad=>{                 
          return this.getEntityDefinitionIdByXMLId(ed.$.id)
            .then(entityDefId=>{          
              return DerivedAttributeDefinition.create(this.jwt, {
                name: ad.$.id,
                description: ad.$.description,
                additionalDescription: ad.$.additionalDescription,
                expression: ad.$.expression,
                explicitAttributeType: ad.$.explicitType,
                entityDefinition: entityDefId,
                uiReference: ad.$.uiReference,
                externalId: ad.$.externalId
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
        let entityDefinitionId = null;
        return this.getEntityDefinitionIdByXMLId(cd.$.entityDefinitionId)
          .then(entityDefinitionIdPersisted=>{    
            entityDefinitionId = entityDefinitionIdPersisted;
            return this.getEntityDefinitionIdByXMLId(cd.$.newEntityDefinitionId);
          })
          .then(newEntityDefinitionIdPersisted=>{     
            const data = {
              name: cd.$.id,
              description: cd.$.description,
              workspace: this.workspaceMap.get(Workspace.$.id),
              ownerPath: cd.$.ownerPath,
              clientPath: cd.$.clientPath,
              entityDefinition: entityDefinitionId,
              newEntityDefinition: newEntityDefinitionIdPersisted,
              newEntityAttachPath: cd.$.newEntityAttachPath,
              notesDefaultValue: cd.$.notesDefaultValue,
              onAvailableHTTPHookURL: cd.$.onAvailableHTTPHookURL,
              onEnableHttpHTTPHookURL: cd.$.onEnableHttpHTTPHookURL,
              onActivateHTTPHookURL: cd.$.onActivateHTTPHookURL,
              onCompleteHTTPHookURL: cd.$.onCompleteHTTPHookURL,
              onTerminateHTTPHookURL: cd.$.onTerminateHTTPHookURL,
              onDeleteHTTPHookURL: cd.$.onDeleteHTTPHookURL,              
              version: this.version
            };
            return CaseDefinition.create(this.jwt, data)
          })
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(cd.$.id, persistedCaseDefinition.id);
            return this.createSummarySectionDefinitions(cd.SummarySectionDefinition, persistedCaseDefinition.id);
          })
          .catch(err=>{
            winston.error(err);
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
          position: ssd.$.position,
          uiReference: ssd.$.uiReference,
          paths: [],
          caseDefinition: caseDefinitionId
        }
        for(let i=0; i<ssd.SummaryParamDefinition.length; i++){
          const param = ssd.SummaryParamDefinition[i];
          if(param.$.path != null)
            data.paths.push(param.$.path);
        };
        return SummarySectionDefinition.create(this.jwt, data);
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
              ownerPath: sd.$.ownerPath,
              repeatable: sd.$.repeatable,
              isMandatory: sd.$.isMandatory,
              activation: sd.$.activation,
              manualActivationExpression: sd.$.manualActivationExpression,
              caseDefinition: caseDefId,
              parentStageDefinition: parentStageDefId,              
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: sd.$.entityAttachPath,
              externalId: sd.$.externalId,
              dynamicDescriptionPath: sd.$.dynamicDescriptionPath
            }
            return StageDefinition.create(this.jwt, data);
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
          .then(caseDefinitionId=>{
            caseDefId = caseDefinitionId;
            return this.createTaskDefinitions2(caseDefId, null, cd.$$);
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
            return this.createTaskDefinitions2(caseDefId, parentStageDefId, sd.$$)
          })
      });
    }

    createTaskDefinitions2(caseDefId, parentStageDefId, taskDefinitions){
      if(taskDefinitions == null)
        return Promise.resolve();
      return Promise.each(taskDefinitions, td=>{
        let taskDefinitionId = null;
        let isHumanTaskDefinition = td['#name']=='HumanTaskDefinition';
        let isAutomatedTaskDefinition = td['#name']=='AutomatedTaskDefinition';
        let isDualTaskDefinition = td['#name']=='DualTaskDefinition';
        if(!(isHumanTaskDefinition || isAutomatedTaskDefinition || isDualTaskDefinition))
          return Promise.resolve();
        return this.getEntityDefinitionIdByXMLId(td.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: td.$.id,
              description: td.$.description,          
              ownerPath: td.$.ownerPath,
              repeatable: td.$.repeatable,
              isMandatory: td.$.isMandatory,              
              activation: td.$.activation,
              manualActivationExpression: td.$.manualActivationExpression,
              caseDefinition: caseDefId,          
              parentStageDefinition: parentStageDefId,                  
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: td.$.entityAttachPath,
              externalId: td.$.externalId,
              dynamicDescriptionPath: td.$.dynamicDescriptionPath,
              footnote: td.$.footnote
            }
            if(isHumanTaskDefinition){   
              data.dueDatePath = td.$.dueDatePath;
              return HumanTaskDefinition.create(this.jwt, data);
            }
            if(isDualTaskDefinition){   
              data.dueDatePath = td.$.dueDatePath;
              data.automaticCompleteOnPath = td.$.automaticCompleteOnPath;
              return DualTaskDefinition.create(this.jwt, data);
            }
            if(isAutomatedTaskDefinition){
              data.automaticCompleteOnPath = td.$.automaticCompleteOnPath;
              return AutomatedTaskDefinition.create(this.jwt, data);
            }
          })
          .then(persistedTaskDef=>{
            if(isHumanTaskDefinition)
              this.humanTaskDefinitionMap.set(td.$.id, persistedTaskDef.id);
            if(isAutomatedTaskDefinition)
              this.automatedTaskDefinitionMap.set(td.$.id, persistedTaskDef.id);  
            if(isDualTaskDefinition)
              this.dualTaskDefinitionMap.set(td.$.id, persistedTaskDef.id);  
            taskDefinitionId = persistedTaskDef.id;
            return this.createTaskParamDefinitions(persistedTaskDef.id, td.TaskParamDefinition);
          })
          .then(()=>{
            return this.createHttpHookDefinitions(taskDefinitionId, td.HttpHookDefinition);
          })
          .then(()=>{
            return Promise.resolve();
          })
          .catch(err=>{
            winston.error(err)
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
          part: tp.$.part,
          isReadOnly: tp.$.isReadOnly,
          isMandatory: tp.$.isMandatory,
          taskDefinition: taskDefinitionId
        }
        return TaskParamDefinition.create(this.jwt, data);
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
            failureMessage: hhd.$.failureMessage,
            processDefinition: processDefinitionId
          }
          return HttpHookDefinition.create(this.jwt, data);
        })
        .then(()=>{
          resolve()
        })
        .catch(err=>{
          winston.error(err);
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
          return SentryDefinition.create(this.jwt, data);
        });
      });
    }

    setCaseDefinitionAsInstantiable(){
      return CaseDefinition.updateById(this.jwt, {id: this.caseDefinitionMap.values().next().value, isInstantiable:true});
    }

    createCase(){
      const caseDefinitionId = this.caseDefinitionMap.values().next().value;
      return Case.create(this.executionJwt, {caseDefinition: caseDefinitionId})   
        .then(case1=>{
          this.case1 = case1;
          return Case.findTreeById(this.executionJwt, case1.id);
        });
    }

    executeCase(isDebug){
      const caseId = this.case1.id;
      const execution = this.json.Execution;
      if(execution == null)
        return Promise.resolve('No Execution Element Defined!');
      const actions = execution[0].Action;
      if(actions == null)
        return Promise.resolve('No Action Element Defined!');
      winston.debug(colors.green('Execute following actions: '))
      actions.forEach(action=>{
        winston.debug(this.getActionConsoleString(action))
      });
      return Promise.each(actions, action=>{
        let p = Promise.resolve();
        if(isDebug && action.$.breakpoint)
          p = prompt('Press enter to continue with action "'+action.$.id+'('+action.$.processId+')": ')
        return p.then(()=>{
          winston.debug(colors.green('Start '+this.getActionConsoleString(action)));          
          if(action.$.id == "ActivateStage"){
            return this.activateStageWithName(caseId, action.$.processId);

          }else if(action.$.id == "CompleteStage"){
            return this.completeStageWithName(caseId, action.$.processId);
  
          }else if(action.$.id == "ActivateHumanTask"){
            return this.activateHumanTaskWithName(caseId, action.$.processId);

          }else if(action.$.id == "ActivateDualTask"){
            return this.activateDualTaskWithName(caseId, action.$.processId);

          }else if(action.$.id == "CompleteHumanTask"){
            const params = this.getParms(action);
            return this.completeHumanTaskWithName(caseId, action.$.processId, params)
          
          }else if(action.$.id == "CompleteAutomatedTask"){
            const params = this.getParms(action);
            return this.completeAutomatedTaskWithName(caseId, action.$.processId, params)
         
          }else if(action.$.id == "CompleteDualTaskHumanPart"){
            const params = this.getParms(action);
            return this.completeDualTaskHumanPartWithName(caseId, action.$.processId, params)
          
          }else if(action.$.id == "CompleteDualTaskAutomatedPart"){
            const params = this.getParms(action);
            return this.completeDualTaskAutomatedPartWithName(caseId, action.$.processId, params)
          
          }else if(action.$.id == "CorrectHumanTask"){
            const params = this.getParms(action);
            return this.correctHumanTaskWithName(caseId, action.$.processId, params)

          }else if(action.$.id == "CorrectDualTaskHumanPart"){
            const params = this.getParms(action);
            return this.correctDualTaskHumanPartWithName(caseId, action.$.processId, params)

          }else if(action.$.id == "CreateAlert"){
            return this.createAlert(caseId, action.$.processId, action)        

          }else if(action.$.id == "Delay"){
            return Promise.delay(200);  

          }else{
            return Promise.resolve('Action "'+action.$.id+'" not defined!');
          }
        })
      })
      .then(()=>{
        this.printHumanTaskDefinitionExecutionCoverage(actions);
        this.printAutomatedTaskDefinitionExecutionCoverage(actions);
        this.printDualTaskDefinitionExecutionCoverage(actions);
        return Case.findTreeById(this.executionJwt, caseId);
      })
    }

    getActionConsoleString(action){
      if(action.$.id != 'Delay'){
        return action.$.id+'('+action.$.processId+')';
      }else{
        return action.$.id+'('+action.$.ms+')';
      }
    }

    getProcessDefinitionXMLIds(actions){
      let XMLIds = new Set();
      actions.forEach(action=>{
        if(action.$.id != 'Delay')
          XMLIds.add(action.$.processId);
      });
      return XMLIds;
    }

    printHumanTaskDefinitionExecutionCoverage(actions){
      let XMLIds = this.getProcessDefinitionXMLIds(actions);
      let humanTaskDefinitionSet = this.humanTaskDefinitionMap.keys();
      let nrCovered = 0;
      let nrTotal = this.humanTaskDefinitionMap.size;
      for(let XMLId of humanTaskDefinitionSet){
        if(XMLIds.has(XMLId))
          nrCovered++;
        else
          winston.warn("No test defined for HumanTaskDefinition: "+XMLId);
      }
      winston.debug("The execution definition covers "+nrCovered+" / "+nrTotal+" HumanTaskDefinitions!");
    }

    printAutomatedTaskDefinitionExecutionCoverage(actions){
      let XMLIds = this.getProcessDefinitionXMLIds(actions);
      let automatedTaskDefinitionSet = this.automatedTaskDefinitionMap.keys();
      let nrCovered = 0;
      let nrTotal = this.automatedTaskDefinitionMap.size;
      for(let XMLId of automatedTaskDefinitionSet){
        if(XMLIds.has(XMLId))
          nrCovered++;
        else
          winston.warn("No test defined for AutomatedTaskDefinition: "+XMLId);
      }
      winston.debug("The execution definition covers "+nrCovered+" / "+nrTotal+" AutomatedTaskDefinitions!");
    }

    printDualTaskDefinitionExecutionCoverage(actions){
      let XMLIds = this.getProcessDefinitionXMLIds(actions);
      let dualTaskDefinitionSet = this.dualTaskDefinitionMap.keys();
      let nrCovered = 0;
      let nrTotal = this.dualTaskDefinitionMap.size;
      for(let XMLId of dualTaskDefinitionSet){
        if(XMLIds.has(XMLId))
          nrCovered++;
        else
          winston.warn("No test defined for DualTaskDefinition: "+XMLId);
      }
      winston.debug("The execution definition covers "+nrCovered+" / "+nrTotal+" DualTaskDefinitions!");
    }

    getParms(action){
      const params = {};
      if(action.TaskParam != null){
        for(let taskParam of action.TaskParam){
          let parts = taskParam.$.path.split('.');
          let name = parts[parts.length-1];
          let pValues = null;
          if(taskParam.$.values != null){
            pValues = JSON.parse(taskParam.$.values.replace(/'/g,'"'));
          }else if(taskParam.$.userValue != null){
            pValues = [this.getUserIdByXMLIdSync(taskParam.$.userValue)];            
          }
          params[name] = pValues;
        }
      }
      return params;
    }

    addParamsToTask(task, paramsMap){
      for(let i=0; i<task.taskParams.length; i++){
        let tp = task.taskParams[i];
        if(paramsMap.hasOwnProperty(tp.name))
          task.taskParams[i].values = paramsMap[tp.name];            
      }
      return task;
    }
   
    completeAutomatedTaskWithName(caseId, taskName, paramsMap){     
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          state: Process.STATE_ACTIVE,
          resourceType: AutomatedTask.getResourceType(),
          name: taskName
        })   
        .then(task=>{          
          return AutomatedTask.complete(this.executionJwt, this.addParamsToTask(task, paramsMap));
        });        
    }

    completeDualTaskHumanPartWithName(caseId, taskName, paramsMap){ 
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          state: Process.STATE_ACTIVE,
          resourceType: DualTask.getResourceType(),
          name: taskName
        })        
       .then(task=>{
         return DualTask.completeHumanPart(this.executionJwt, this.addParamsToTask(task, paramsMap));
       });        
   }

  completeStageWithName(caseId, stageName){   
    return Process.findByCaseQueryLast(this.executionJwt, caseId, {
        state: Process.STATE_ACTIVE,
        resourceType: Stage.getResourceType(),
        name: stageName
      })   
     .then(stage=>{  
       return Stage.complete(this.executionJwt, stage.id);
     });      
  }

  terminateStageWithName(caseId, stageName){     
    return Process.findByCaseQueryLast(this.executionJwt, caseId, {
        state: Process.STATE_ACTIVE,
        resourceType: Stage.getResourceType(),
        name: stageName
      })   
    .then(stage=>{  
       return Stage.terminate(this.executionJwt, stage.id);
     });      
  }

   completeDualTaskAutomatedPartWithName(caseId, taskName, paramsMap){     
    return Process.findByCaseQueryLast(this.executionJwt, caseId, {
        state: Process.STATE_ACTIVE,
        resourceType: DualTask.getResourceType(),
        name: taskName
      })       
     .then(task=>{
       return DualTask.completeAutomatedPart(this.executionJwt, this.addParamsToTask(task, paramsMap));
     });        
  }

    activateStageWithName(caseId, stageName){
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
        resourceType: Stage.getResourceType(),
        name: taskName,
        possibleActions: Process.POSSIBLEACTION_ACTIVATE
      }) 
      .then(stage=>{       
        if(stage){
          return Stage.activate(this.executionJwt, stage.id);
        }else{
          return Promise.reject('Could not activate Stage "'+stageName+'"!')
        }       
      });
    }

    activateHumanTaskWithName(caseId, taskName){
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          resourceType: HumanTask.getResourceType(),
          name: taskName,
          possibleActions: Process.POSSIBLEACTION_ACTIVATE
        }) 
        .then(task=>{
          if(task){
            return HumanTask.activate(this.executionJwt, task.id);
          }else{
            return Promise.reject('Could not activate HumanTask "'+taskName+'"!')
          }       
        });
    }


    activateDualTaskWithName(caseId, taskName){
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          resourceType: DualTask.getResourceType(),
          name: taskName,
          possibleActions: Process.POSSIBLEACTION_ACTIVATE
        }) 
        .then(task=>{
          if(task){
            return DualTask.activate(this.executionJwt, task.id);
          }else{
            return Promise.reject('Could not activate DualTask "'+taskName+'"!')
          }       
        });
    }

    /**
     * @param caseId 
     * @param taskName 
     * @param paramsMap {attrName1:[value1, value2], attrName2: [value1, value2]}
     */
    completeHumanTaskWithName(caseId, taskName, paramsMap){  
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          state: Process.STATE_ACTIVE,
          resourceType: HumanTask.getResourceType(),
          name: taskName
        })       
        .then(task=>{
          return HumanTask.complete(this.executionJwt, this.addParamsToTask(task, paramsMap));
        })      
    }

    /**
     * @param caseId 
     * @param taskName 
     * @param paramsMap {attrName1:[value1, value2], attrName2: [value1, value2]}
     */
    correctHumanTaskWithName(caseId, taskName, paramsMap){  
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          state: Process.STATE_COMPLETED,
          resourceType: HumanTask.getResourceType(),
          name: taskName
        })       
        .then(task=>{
          return HumanTask.correct(this.executionJwt, this.addParamsToTask(task, paramsMap));
        })      
    }

    /**
     * @param caseId 
     * @param taskName 
     * @param paramsMap {attrName1:[value1, value2], attrName2: [value1, value2]}
     */
    correctDualTaskHumanPartWithName(caseId, taskName, paramsMap){  
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          state: Process.STATE_COMPLETED,
          resourceType: DualTask.getResourceType(),
          name: taskName
        })       
        .then(task=>{
          return DualTask.correctHumanPart(this.executionJwt, this.addParamsToTask(task, paramsMap));
        })      
    }

    createAlert(caseId, processName, action){
      return Process.findByCaseQueryLast(this.executionJwt, caseId, {
          resourceType: Process.getResourceType(),
          name: processName
        })         
        .then(p=>{
          const data = {
            process: p.id,
            creationDate: action.$.creationDate,
            expireDate: action.$.expireDate,
            text: action.$.text,
	          data: action.$.data,
          };
          if(data.data != null)
            data.data = JSON.parse(data.data.replace(/'/g,'"'));
          return Alert.create(this.executionJwt, data);
        });        
    }

}
