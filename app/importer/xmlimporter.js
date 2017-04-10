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
        this.entityDefinitionMap = new Map(); //<entityName, sociocortexId>
        this.attributeDefinitionMap = new Map(); //<entityName.attrName, sociocortexId>
        this.derivedAttributeDefinition = new Map(); //<entityName.derAttrName, sociocortexId>
        this.caseDefinitions = new Map(); //<name, sociocortexId>
        this.humanTaskDefinitions = new Map(); //<name, sociocortexId>
    }

    getEntityDefinitionIdByName(entityDefinitionName){
      return this.entityDefinitionMap.get(entityDefinitionName);
    }

    import(filePath){
        if(!fs.existsSync(filePath)) {
          console.log('Filex does not exist ' + filePath);
          return Promise.reject('File does not exist');
        }

        const xmlString = fs.readFileSync(filePath).toString();
        return new Promise((resolve, reject)=>{
            xml.parseStringAsync(xmlString)
                .then(json=>{
                    this.json = json.SACMDefinition;
                    return this.resetWorkspace(WORKSPACE_ID);
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
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err);
                });
        });
    }


    resetWorkspace(name) {
      return SocioCortex.workspace.delete(name, true).then(() => {
        return SocioCortex.workspace.create(name);
      });
    }


    createEntityDefinitions() {
      return Promise.each(this.json.DataDefinition[0].EntityDefinition, ed=>{
        return SocioCortex.entityType.create(WORKSPACE_ID, ed.$.name)
          .then(persistedEntityDefinition =>{
            this.entityDefinitionMap.set(ed.$.name, persistedEntityDefinition.id);            
            return Promise.resolve();
          });
      });
    }


    createAttributeDefintions() {
      return Promise.each(this.json.DataDefinition[0].EntityDefinition, ed=>{
        console.log(ed.AttributeDefinition);
        return Promise.each(ed.AttributeDefinition, ad=>{
          let data = {
            name: ad.$.name,
            attributeType: 'notype', //ad.$.type, //TODO add here
            options: {},
            multiplicity: 'any'
          }
          const entityDefId = this.getEntityDefinitionIdByName(ed.$.name);
          SocioCortex.attributeDefinition.create(WORKSPACE_ID, entityDefId, data)
            .then(persistedAttributeDefinition =>{
              this.attributeDefinitionMap.set(ed.$.name+ad.$.name, persistedAttributeDefinition.id);            
              return Promise.resolve();
            })
            .catch(err=>{
              return Promise.reject(err);
            })
        });
      });
    }

    createCaseDefinitions() {
      console.log(this.json.CaseDefinition);
      return Promise.each(this.json.CaseDefinition, cd=>{   
        const name = cd.$.name;
        SocioCortex.caseDefinition.create(WORKSPACE_ID, entityDefId, data)
          .then(persistedCaseDefinition =>{
            this.caseDefinitionMap.set(ed.$.name+ad.$.name, persistedCaseDefinition.id);            
            return Promise.resolve();
          })
          .catch(err=>{
            return Promise.reject(err);
          })
  
      });

      /*
      return Promise.each(this.json.CaseDefinition[0], ed=>{
        console.log(ed.AttributeDefinition);
        return Promise.each(ed.AttributeDefinition, ad=>{
          let data = {
            name: ad.$.name,
            attributeType: 'notype', //ad.$.type, //TODO add here
            options: {},
            multiplicity: 'any'
          }
          const entityDefId = this.getEntityDefinitionIdByName(ed.$.name);
          SocioCortex.attributeDefinition.create(WORKSPACE_ID, entityDefId, data)
            .then(persistedAttributeDefinition =>{
              this.attributeDefinitionMap.set(ed.$.name+ad.$.name, persistedAttributeDefinition.id);            
              return Promise.resolve();
            })
            .catch(err=>{
              return Promise.reject(err);
            })
        });
      });
      */
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
