'use strict';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request-promise';
import xml2js from 'xml2js';
import sacmAPI from './sacmapi';
import SocioCortex from './sociocortex';
const xml = Promise.promisifyAll(xml2js);

const WORKSPACE_ID = 'a2j7z68u5m1d';


module.exports = class XMLImporter {

    constructor() {
        this.caseDefinitions = new Map();
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

                    this.processDataDefinition().then((result) => {
                      console.log('%%%%%% RESULT %%%%%%');
                        result.forEach((res)=> {
                          console.log(res.entityType.attributeDefinitions[0])
                        })
                    });

                })
                .then(()=>{
                  return;
                    return this.createCaseDefinition();
                })
                .thne(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err);
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
            sacmAPI.createCaseDefinition({
                name: this.json.CaseDefinition[0].$.name
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
