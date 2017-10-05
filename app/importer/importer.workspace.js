'use strict';
import Promise from 'bluebird';
import Importer from './importer';
import Workspace from '../models/workspace/model.workspace';
import UserDefinition from '../models/group/model.userdefinition';
import User from '../models/group/model.user';
import Group from '../models/group/model.group';

module.exports = class WorkspaceImporter extends Importer{

    constructor() {
      super();
    }

    importLocalFile(jwt, localFile){
      return this.parseXMLFile(localFile)
        .then(json=>{
          return this.import(jwt, json);
        });
    }

    importAttachedFile(jwt, attachedFile){
      return this.parseXMLString(attachedFile)
        .then(json=>{
          return this.import(jwt, json);
        });
    }

    import(jwt, json){ 
      this.jwt = jwt;  
      this.json = json.SACMDefinition;
      return this.initializeMaps()
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
        .then(()=>{
          return Workspace.findAll(this.jwt);
        });   
    }

   

}
