'use strict';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request-promise';
import xml2js from 'xml2js';
import sacmAPI from './sacmapi';
const xml = Promise.promisifyAll(xml2js);


module.exports = class XMLImporter {
      
    constructor() {
        this.caseDefinitions = new Map();
    }

    import(filePath){
        const xmlString = fs.readFileSync(filePath).toString();
        return new Promise((resolve, reject)=>{            
            xml.parseStringAsync(xmlString)
                .then(json=>{
                    this.json = json.SACMDefinition;
                    return this.createEntityDefinition();
                })
                .then(()=>{
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

    createEntityDefinition(){
        return new Promise((resolve, reject)=>{
            resolve();
        })
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