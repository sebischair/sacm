'use strict';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request-promise';
import xml2js from 'xml2js';
import SocioCortex from './sociocortex';
const xml = Promise.promisifyAll(xml2js);

const WORKSPACE_ID = 'connecare2017';


module.exports = class XMLImporter {

    constructor() {
      this.entityDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.attributeDefinitionMap = new Map(); //<xmlEntityId+xmlAttrId, sociocortexId>
      this.derivedAttributeDefinitionMap = new Map(); //<entityName.derAttrName, sociocortexId>
      this.caseDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.stageDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.humanTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
      this.automatedTaskDefinitionMap = new Map(); //<xmlId, sociocortexId>
    }

    getEntityDefinitionIdByXMLId(entityDefinitionXMLId){
      if(!this.entityDefinitionMap.has(entityDefinitionXMLId))
        return Promise.reject('ERR EntityDefintion ID not found');
      return Promise.resolve(this.entityDefinitionMap.get(entityDefinitionXMLId));
    }

    getCaseDefinitionIdByXMLId(caseDefinitionXMLId){
      if(!this.caseDefinitionMap.has(caseDefinitionXMLId))
        console.log('ERR CaseDefinition ID not found')
      return this.caseDefinitionMap.get(caseDefinitionXMLId);
    }

    getStageDefinitionIdByXMLId(stageDefinitionXMLId){
      if(!this.stageDefinitionMap.has(stageDefinitionXMLId))
        console.log('ERR StageDefinition ID not found')
      return this.stageDefinitionMap.get(stageDefinitionXMLId);
    }

    import(filePath){
      if(!fs.existsSync(filePath)) 
        return Promise.reject('File does not exist' + filePath);

      return xml.parseStringAsync(fs.readFileSync(filePath).toString())
        .then(json=>{
          this.json = json.SACMDefinition;
          return this.deleteAndCreateWorkspace();
        })
        .then(() => {
          return this.createEntityDefinitions();
        })
        .then(() => {
          return this.createAttributeDefinitions();
        })
        
        .then(() => {
          return Promise.resolve();
          //return this.createDerivedAttributeDefinitions();
        })  
        .then(() => {
          return this.createCaseDefinitions();
        })
      /*
        .then(() => {
          return this.createStageDefinitions();
        })
        .then(() => {          
          return this.createTaskDefinitions();
        })*/
        .then(()=>{
          return Promise.resolve();
        })
        .catch(err=>{
          return Promise.reject(err);
        });        
    }


    deleteAndCreateWorkspace() {
      return SocioCortex.workspace.delete(WORKSPACE_ID, true).then(() => {
        return SocioCortex.workspace.create(WORKSPACE_ID);
      });
    }

    createEntityDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
        return SocioCortex.entityType.create(WORKSPACE_ID, ed.$.id)
          .then(persistedEntityDefinition =>{
            this.entityDefinitionMap.set(ed.$.id, persistedEntityDefinition.id);            
            return Promise.resolve();
          });
      });
    }

    createAttributeDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
        return Promise.each(ed.AttributeDefinition, ad=>{
          let data = {
            name: ad.$.id,
            attributeType: 'notype', //ad.$.type, //TODO add here
            options: {},
            multiplicity: 'any'
          }
          return this.getEntityDefinitionIdByXMLId(ed.$.id)
            .then(entityDefId => {
              return SocioCortex.attributeDefinition.create(WORKSPACE_ID, entityDefId, data);
            })
            .then(persistedAttributeDefinition =>{
              this.attributeDefinitionMap.set(ed.$.id+ad.$.id, persistedAttributeDefinition.id);            
              return Promise.resolve();
            })
            .catch(err=>{
              return Promise.reject(err);
            });       
        });
      });
    }

/*
    createDerivedAttributeDefinitions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
        return Promise.each(ed.DerivedAttributeDefinition, ad=>{
          const data = {
            name: ad.$.id,
            description: ad.$.label,    
            expression: ad.$.expression
          };
          const entityDefId = this.getEntityDefinitionIdByXMLId(ed.$.id);
          return SocioCortex.derivedAttributeDefinition.create(WORKSPACE_ID, entityDefId, data)
            .then(persistedAttributeDefinition =>{
              this.derivedAttributeDefinitionMap.set(ed.$.id+ad.$.id, persistedAttributeDefinition.id);            
              return Promise.resolve();
            })
            .catch(err=>{
              return Promise.reject(err);
            })
        });
      });
    }
    */

    createCaseDefinitions() {      
      return Promise.each(this.json.CaseDefinition, cd=>{    
        return this.getEntityDefinitionIdByXMLId(cd.$.entityDefinitionId)
          .then(entityDefinitionId=>{
            const data = {
              name: cd.$.id,
              label: cd.$.label,
              entityDefinition: {id: entityDefinitionId}
            };
            return SocioCortex.caseDefinition.create(data)
          })        
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(cd.$.id, persistedCaseDefinition.id);         
            return Promise.resolve();
          })
          .catch(err=>{
            return Promise.reject(err);
          });     
      });  
    }

    createStageDefinitions() {       
      return Promise.each(this.json.CaseDefinition, cd=>{ 
        return this.getCaseDefinitionIdByXMLId(cd.$.id)
          .then(caseDefId=>{
            return this.createStageDefinitionRecursive(caseDefId, null, cd.StageDefinition);
          })        
      });   
    }

    createStageDefinitionRecursive(caseDefId, parentStageDefId, stageDefinitions){   
      if(stageDefinitions == null)
        return Promise.resolve();
      return Promise.each(stageDefinitions, sd=>{        
        const data = {
          name: sd.$.id,
          label: sd.$.id,
          isRepeatable: sd.$.isRepeatable,
          isMandatory: sd.$.isMandetory,
          caseDefinition: {id: caseDefId}
        }
        if(parentStageDefId != null) 
          data.parentStageDefinition = {id: parentStageDefId};
        return SocioCortex.stageDefinition.create(data)
          .then(persistedStageDef=>{
            this.stageDefinitionMap.set(sd.$.id, persistedStageDef.id);     
            return this.createStageDefinitionRecursive(caseDefId, persistedStageDef.id, sd.StageDefinition);
          })
          .catch(err=>{
            return Promise.reject(err);
          });
      });      
    }

    createTaskDefinitions(){
      return Promise.each(this.json.CaseDefinition, cd=>{ 
        const caseDefId = this.getCaseDefinitionIdByXMLId(cd.$.id);
        return this.createHumanTaskDefinitons(caseDefId, null, cd.HumanTaskDefinition)
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
        const parentStageDefId = this.getStageDefinitionIdByXMLId(sd.$.id);
        return this.createTaskDefinitionRecursive(caseDefId, parentStageDefId, sd.StageDefinition)
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
        const data = {
          name: td.$.id,
          label: td.$.id,
          isRepeatable: td.$.isRepeatable,
          isMandatory: td.$.isMandetory,
          caseDefinition: {id: caseDefId},
        }  
        if(parentStageDefId != null) 
          data.parentStageDefinition = {id: parentStageDefId};
        return SocioCortex.humanTaskDefinitions.create(data)
          .then(persistedHumanTaskDef=>{
            this.humanTaskDefinitionMap.set(td.$.id, persistedHumanTaskDef.id);  
            return this.createTaskParamDefinitions(persistedHumanTaskDef.id, td.TaskParamDefinition);
          })
          .then(()=>{
            return Promise.resolve();   
          })
          .catch(err=>{
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
          label: td.$.id,
          isRepeatable: td.$.isRepeatable,
          isMandatory: td.$.isMandetory,
          caseDefinition: {id: caseDefId}
        }
        if(parentStageDefId != null) 
          data.parentStageDefinition = {id: parentStageDefId};
        return SocioCortex.automatedTaskDefinitions.create(data)
          .then(persistedAutomatedTaskDef=>{
            this.automatedTaskDefinitionMap.set(td.$.id, persistedAutomatedTaskDef.id);    
            return this.createTaskParamDefinitions(persistedAutomatedTaskDef.id, td.TaskParamDefinition);
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
          taskDefinition: {id: taskDefinitionId}
        }
        return SocioCortex.taskParamDefinitions.create(data);
      });      
    }

    createSentryDefintions(){

    }




    /**
      This method creates all EntityTypes, AttributeDefinitions and DerivedAttributeDefinitions including all references
    **/
    processDataDefinition() {

      let entityTypes = this.json.DataDefinition[0].EntityType;
      var createdEntityTypes = Promise.all(entityTypes.map(this.createEntityType));
      return createdEntityTypes.then(
        // All EntityTypes are created
        (entityTypes) => {

          // Go through all EntityTypes
          return Promise.map(entityTypes,
            (entityType) => {

                let xmlAttributeDefinitions = entityType.source.AttributeDefinition;
                let createdAttributeDefinitions = Promise.all(xmlAttributeDefinitions.map(
                  (x) => { return this.createAttributeDefinition(x, entityTypes, entityType.id)}
                ));

                // Create all attributes and resolve potential references to entities
                return createdAttributeDefinitions.then(
                  (attributeDefinitions) => {

                    //console.log('#### ATTRIBUTE DEFINITIONS ####');
                    //console.log(attributeDefinitions);

                    // All attributes (including references) are created
                    // Create DerivedAttributeDefinitions
                    let xmlDerivedAttributeDefinitions = entityType.source.DerivedAttributeDefinition;
                    if(typeof xmlDerivedAttributeDefinitions === 'undefined') {

                      // No DerivedAttributeDefinitions
                      return Promise.resolve({entityType: {
                        self: entityType,
                        attributeDefinitions: attributeDefinitions
                      }});
                    }

                    let createdDerivedAttributeDefinitions = Promise.all(xmlDerivedAttributeDefinitions.map(this.createDerivedAttributeDefinition));

                    return createdDerivedAttributeDefinitions.then(
                      (derivedAttributeDefinitions) => {

                        return Promise.resolve({entityType: {
                          self: entityType,
                          attributeDefinitions: attributeDefinitions,
                          derivedAttributeDefinitions: derivedAttributeDefinitions
                        }});

                        //console.log('#### DERIVED ATTRIBUTE DEFINITIONS ####');
                        //console.log(derivedAttributeDefinitions);
                    });
                  });
            });
      });
    }


    createDerivedAttributeDefinition(derivedAttributeDefinition) {
      return Promise.resolve({_type: 'DerivedAttributeDefinition', name: derivedAttributeDefinition.$.name, source: derivedAttributeDefinition});
    }

    createAttributeDefinition(attributeDefinition, entities=[], entityTypeId) {
      // Attach actual entity ids
      let type = attributeDefinition.$.type;

      var data = {
        name: attributeDefinition.$.name,
        attributeType: attributeDefinition.$.type,
        options: {},
        multiplicity: 'any'
      }

      // Resolve dot notation
      let xtype = type.split('.');
      if(xtype.length > 2) {
        data.attributeType = xtype[0];
        // Get last element in dot notation
        let elementCandidate = xtype[xtype.length - 1];

        // TODO Check for entitiy types
        if(elementCandidate !== '...') {
          // We have a reference to element candidate
          // Get element candidate from entities
          entities.forEach(
            (entitiy) => {
                if(entitiy.name === elementCandidate) {
                  // Attach actual entitiy id to attributeDefinition
                  attributeDefinition.reference = entitiy;

                  // Set options object with referecing EntityType ID
                  data.options = {
                    "entityType": {
                      "id": entitiy.id
                    },
                    "resourceType": "entities"
                  }

                }
            });
        }
      } else if(xtype.length > 1) {
        data.attributeType = xtype[0];
        data.options = {
          "resourceType": "entities"
        }
      }

      // Create element here ...
      console.log(attributeDefinition.$.name);

      return SocioCortex.attributeDefinition.create(WORKSPACE_ID, entityTypeId, data).then(
        (result) => {
          console.log('THIS ADD SC:::::');
          return Promise.resolve(result);
        }
      )




      return Promise.resolve({_type: 'attribute', name: attributeDefinition.$.name, source: attributeDefinition});
    }


    createEntityType(entityType){
      return SocioCortex.entityType.create(WORKSPACE_ID, entityType.$.name).then(
        (result) => {
          result.source = entityType;
          return Promise.resolve(result);
        }
      )
    }

  


}
