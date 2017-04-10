'use strict';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request-promise';
import xml2js from 'xml2js';
import sacmAPI from './sacmapi';
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
    }

    getEntityDefinitionIdByName(entityDefinitionName){
      return this.entityDefinitionMap.get(entityDefinitionName);
    }

    getCaseDefinitionIdByName(caseDefinitionName){
      if(!this.caseDefinitionMap.has(caseDefinitionName))
        console.log('ERR CaseDefintion ID not found')
      return this.caseDefinitionMap.get(caseDefinitionName);
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
            return this.createAttributeDefintions();
        })
        .then(() => {
            return this.createCaseDefinitions();
        })
        .then(() => {
            return this.createStageDefinitions();
        })
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

    createAttributeDefintions() {
      return Promise.each(this.json.EntityDefinition, ed=>{
        return Promise.each(ed.AttributeDefinition, ad=>{
          let data = {
            name: ad.$.id,
            attributeType: 'notype', //ad.$.type, //TODO add here
            options: {},
            multiplicity: 'any'
          }
          const entityDefId = this.getEntityDefinitionIdByName(ed.$.id);
          SocioCortex.attributeDefinition.create(WORKSPACE_ID, entityDefId, data)
            .then(persistedAttributeDefinition =>{
              this.attributeDefinitionMap.set(ed.$.id+ad.$.id, persistedAttributeDefinition.id);            
              return Promise.resolve();
            })
            .catch(err=>{
              return Promise.reject(err);
            })
        });
      });
    }

    createCaseDefinitions() {      
      return Promise.each(this.json.CaseDefinition, cd=>{         
        const data = {
          name: cd.$.id,
          label: cd.$.label,
          entityDefinition: {id: this.getEntityDefinitionIdByName(cd.$.entityDefinitionId)}
        };
        return SocioCortex.caseDefinition.create(data)
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(cd.$.id, persistedCaseDefinition.id);            
            Promise.resolve();
          })
          .catch(err=>{
            Promise.reject(err);
          });     
      });  
    }

    createStageDefinitions() {       
      return Promise.each(this.json.CaseDefinition, cd=>{        
        if(cd.StageDefinition)
          return this.createStageDefinitionRecursive(this.getCaseDefinitionIdByName(cd.$.id), null, cd.StageDefinition);
        else
          return Promise.resolve();
      });   
    }

    createStageDefinitionRecursive(caseDefId, parentStageDefId, stageDefinitions){   
      return Promise.each(stageDefinitions, sd=>{        
        const data = {
          name: sd.$.id,
          label: sd.$.id,
          isRepeatable: sd.$.isRepeatable,
          isMandatory: sd.$.isMandetory,
          caseDefinition: {id: caseDefId},
          parentStageDefintion: {id: parentStageDefId}
        }
        return SocioCortex.stageDefintion.create(data)
          .then(persistedStageDef=>{
            console.log(persistedStageDef)
            this.stageDefinitionMap.set(sd.$.id, persistedStageDef.id);
            if(sd.StageDefinition)
              return this.createStageDefinitionRecursive(caseDefId, persistedStageDef.id, sd.StageDefinition);
            else
              Promise.resolve();
          })
          .catch(err=>{
            Promise.reject(err);
          });
      });      
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

    createCaseDefinition(){
        return new Promise((resolve, reject)=>{
            if(!this.json.CaseDefinition)
                reject('Has no CaseDefinition!');
            if(this.json.CaseDefinition.length != 1)
                reject('Only one Case Definition Allowed!');
            if(!this.json.CaseDefinition[0].$.name)
                reject('No Case Definition Name defined!');
            SocioCortex.caseDefinition.create({
                name: this.json.CaseDefinition[0].$.name,
                label: this.json.CaseDefinition[0].$.label
            })
            .then(caseDefinition=>{
                console.log('here', caseDefinition);
                //this.caseDefinitionId = caseDefinition.id;
                //TODO add more here
                resolve();
            })
            .catch(err=>{
                reject(err);
            })
        });
    }


}
