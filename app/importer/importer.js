'use strict';
import Promise from 'bluebird';
import request from 'request-promise';
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
import TaskParamDefinition from '../models/casedefinition/model.taskparamdefinition';
import HttpHookDefinition from '../models/casedefinition/model.httphookdefinition';
import SentryDefinition from '../models/casedefinition/model.sentrydefinition';
import Case from '../models/case/model.case';
import Stage from '../models/case/model.stage';
import HumanTask from '../models/case/model.humantask';
import AutomatedTask from '../models/case/model.automatedtask';
import Process from '../models/case/model.process';
import Alert from '../models/case/model.alert';
import Settings from '../models/settings/model.settings';
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

    getUserIdByXMLIdSync(userXMLId){
        if(userXMLId == null)
          return null
        else if(!this.userMap.has(userXMLId)){
          console.log('ERROR: User ID "'+userXMLId+'" not found');
          return new Error('ERROR: User ID "'+userXMLId+'" not found');
        }else
          return this.userMap.get(userXMLId);  
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
          console.error('ERROR: PrincipalId "'+principalXMLId+'" not found or not unique! Found count: '+count);
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
      });
    }

    parseXMLString(xmlString){
      return xml2jspromise.parseStringAsync(xmlString, {explicitChildren:true, preserveChildrenOrder:true});
    }

    import(jwt, file, isExecuteCase, executionJwt){ 
      let path = 'app/importer/';
      let filePath = path+file;
      this.jwt = jwt;     
      this.executionJwt = executionJwt;
      return this.fileExists(filePath)
        .then(exist =>{
          if(!exist)
            throw new Error('File does not exist' + filePath);
          else {         
            //return xml.parseStringAsync(fs.readFileSync(filePath).toString());
            let xml = fs.readFileSync(filePath).toString();
            let includes = xml.match(/<include.*>/g);
            if(includes)
              includes.forEach(include=> {
                let href = include.match(/src=".*"/g);
                if(href !== null){
                  href = href[0];
                  href = href.replace('src="','').replace('"','');
                  if(!fs.existsSync(path+'/'+href))
                    throw new Error('Could not find include file: '+path+'/'+href);
                  let incXml = fs.readFileSync(path+'/'+href).toString();  
                  xml = xml.replace(include, incXml);
                }
              });
            fs.writeFileSync(filePath+'.merged.xml.tmp',xml);
            return xml2jspromise.parseStringAsync(xml);
          }
        })
        .then(json=>{
          this.json = json.SACMDefinition;
          fs.writeFileSync(filePath+'.merged.json.tmp',JSON.stringify(this.json,null,3));
          return this.initializeMaps();
        })
        .then(()=>{
          return Workspace.deleteAll(this.jwt);
        })
        .then(()=>{
          return this.deleteUserDefinitionAttributeDefinitions();
        })
        .then(()=>{
          return this.createUserDefinition();
        })
        .then(()=>{
          return Group.deleteAll(this.jwt);                  
        })
        .then(()=>{
          return User.deleteAll(this.jwt);  
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
          return this.createAdminMemberships();
        })
        .then(()=>{
          return this.updateSettings();
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
            return this.executeCase();
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
            console.error(err);
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
          password: 'ottto',
          passwordAgain: 'ottto',
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
            console.error(err);
          })
      });
    }

    createGroups(){
      return Promise.each(this.json.Group, g=>{
        const data = {
          name: g.$.name,
          description: g.$.description,
          administrators: []
        }
        if(g.$.staticId != null)
          data.id = g.$.staticId;
        if(g.Administrator == null){
          console.error('No administrator defined for group!');
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
      const ref = type.split('.');   
      const validTypes = ['link', 'notype', 'string', 'longtext', 'boolean', 'number', 'enumeration', 'date', 'json'];
      if(validTypes.indexOf(ref[0].toLowerCase()) == -1){        
        console.log('Could not resolve attribute "'+type+'" type!');
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
          console.log('A Enumeration should provide at least one value!');
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
        return this.getEntityDefinitionIdByXMLId(cd.$.entityDefinitionId)
          .then(entityDefinitionId=>{            
            const data = {
              name: cd.$.id,
              description: cd.$.description,
              workspace: this.workspaceMap.get(Workspace.$.id),
              ownerPath: cd.$.ownerPath,
              clientPath: cd.$.clientPath,
              entityDefinition: entityDefinitionId,
              version: this.version
            };
            return CaseDefinition.create(this.jwt, data)
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
              isManualActivation: sd.$.isManualActivation,
              caseDefinition: caseDefId,
              parentStageDefinition: parentStageDefId,              
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: sd.$.entityAttachPath,
              externalId: sd.$.externalId
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
        if(!(isHumanTaskDefinition || isAutomatedTaskDefinition))
          return Promise.resolve();
        return this.getEntityDefinitionIdByXMLId(td.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: td.$.id,
              description: td.$.description,          
              ownerPath: td.$.ownerPath,
              repeatable: td.$.repeatable,
              isMandatory: td.$.isMandatory,              
              isManualActivation: td.$.isManualActivation,
              caseDefinition: caseDefId,          
              parentStageDefinition: parentStageDefId,                  
              newEntityDefinition: entityDefinitionId,
              newEntityAttachPath: td.$.entityAttachPath,
              externalId: td.$.externalId
            }
            if(isHumanTaskDefinition){   
              data.dueDatePath = td.$.dueDatePath;
              return HumanTaskDefinition.create(this.jwt, data);
            }
            if(isAutomatedTaskDefinition)       
              return AutomatedTaskDefinition.create(this.jwt, data);
          })
          .then(persistedTaskDef=>{
            if(isHumanTaskDefinition)
              this.humanTaskDefinitionMap.set(td.$.id, persistedTaskDef.id);
            if(isAutomatedTaskDefinition)
              this.automatedTaskDefinitionMap.set(td.$.id, persistedTaskDef.id);  
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
            console.log(err)
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
          return SentryDefinition.create(this.jwt, data);
        });
      });
    }

    createCase(){
      const caseDefinitionId = this.caseDefinitionMap.values().next().value;
      return Case.create(this.executionJwt, {caseDefinition: caseDefinitionId})   
        .then(case1=>{
          this.case1 = case1;
          return Case.findTreeById(this.executionJwt, case1.id);
        });
    }

    executeCase(){
      const caseId = this.case1.id;
      const execution = this.json.Execution;
      if(execution == null)
        return Promise.resolve('No Execution Element Defined!');
      const actions = execution[0].Action;
      if(actions == null)
        return Promise.resolve('No Action Element Defined!');
      return Promise.each(actions, action=>{
        let p = Promise.resolve();
        if(action.$.cmdConfirm)
          p = prompt('Press enter to continue with action "'+action.$.id+'('+action.$.processId+')": ')
        return p.then(()=>{
          if(action.$.id == "ActivateStage"){
            return this.activateStageWithName(caseId, action.$.processId);

          }else if(action.$.id == "CompleteHumanTask"){
            const params = this.getParms(action);
            return this.completeHumanTaskWithName(caseId, action.$.processId, params)
          
          }else if(action.$.id == "CompleteAutomatedTask"){
            const params = this.getParms(action);
            return this.completeAutomatedTaskWithName(caseId, action.$.processId, params)

          }else if(action.$.id == "CreateAlert"){
            return this.createAlert(caseId, action.$.processId, action)        

          }else{
            return Promise.resolve('Action "'+action.$.id+'" not defined!');
          }
        })
      })
      .then(()=>{
        return Case.findTreeById(this.executionJwt, caseId);
      })
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
   
    completeAutomatedTaskWithName(caseId, taskName, paramsMap){     
       return AutomatedTask.findAllByCaseId(this.executionJwt, caseId)
        .then(tasks=>{          
          const t = this.findProcessWithName(tasks, taskName);
          return AutomatedTask.findById(this.executionJwt, t.id);
        })        
        .then(task=>{
          for(let i=0; i<task.taskParams.length; i++){
            let tp = task.taskParams[i];
            if(paramsMap.hasOwnProperty(tp.name))
              task.taskParams[i].values = paramsMap[tp.name];            
          }
          return AutomatedTask.complete(this.executionJwt, task);
        });        
    }

    activateStageWithName(caseId, stageName){
      return Stage.findAllByCaseId(this.executionJwt, caseId)
      .then(allStages=>{
        let foundStage = null;
        allStages.forEach(repeatedStages=>{
          repeatedStages.forEach(repeatedStage=>{
            if(!foundStage && repeatedStage.name == stageName && repeatedStage.possibleActions.includes('ACTIVATE')){
              foundStage = repeatedStage;              
            }
          });
        });
        if(foundStage){
          return Stage.activate(this.executionJwt, foundStage.id);
        }else{
          return Promise.reject('Could not activate Stage "'+stageName+'"!')
        }       
      });
    }

    /**
     * @param caseId 
     * @param taskName 
     * @param paramsMap {attrName1:[value1, value2], attrName2: [value1, value2]}
     */
    completeHumanTaskWithName(caseId, taskName, paramsMap){     
       return HumanTask.findAllByCaseId(this.executionJwt, caseId)
        .then(humanTasks=>{          
          const ht = this.findProcessWithName(humanTasks, taskName);
          return HumanTask.findById(this.executionJwt, ht.id);
        })        
        .then(humanTask=>{
          for(let i=0; i<humanTask.taskParams.length; i++){
            let tp = humanTask.taskParams[i];
            if(paramsMap.hasOwnProperty(tp.name))
              humanTask.taskParams[i].values = paramsMap[tp.name];            
          }
          return HumanTask.complete(this.executionJwt, humanTask);
        });        
    }

    findProcessWithName(nestedProcesses, searchedName){
      for(let process of nestedProcesses)     
        for(let instance of process)
          if(instance.name == searchedName)
            return instance;
      return null;
    }

    createAlert(caseId, processName, action){
       return Process.findAllByCaseId(this.executionJwt, caseId)
        .then(processes=>{          
          const p = this.findProcessWithName(processes, processName);
          return Process.findById(this.executionJwt, p.id);
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
