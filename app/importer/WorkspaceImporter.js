'use strict';
import Promise from 'bluebird';
import fs from 'fs';
import xml2js from 'xml2js';
import XMLImporter from './xmlimporter';
import Workspace from '../models/workspace/model.workspace';
import UserDefinition from '../models/group/model.userdefinition';
import User from '../models/group/model.user';
import Group from '../models/group/model.group';
const xml2jspromise = Promise.promisifyAll(xml2js);

module.exports = class WorkspaceImporter extends XMLImporter{

    constructor() {
      super();
    }

    import(jwt, file){ 
      let path = 'app/importer/';
      let filePath = path+file;
      this.jwt = jwt;     
      return this.fileExists(filePath)
        .then(exist =>{
          console.log('here'+filePath);
          if(!exist)
            throw new Error('File does not exist' + filePath);
          else {         
            return xml2jspromise.parseStringAsync(fs.readFileSync(filePath).toString());
          }
        })
        .then(json=>{
          this.json = json.SACMDefinition;
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
        });     
    }

   

}
