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
        let startXML = attachedFile.indexOf("<?xml");
        console.log(attachedFile.replace("\ufeff", "").substr(0,1000));
        attachedFile = attachedFile.substr(startXML);
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
            console.log("Del User&AttrDef");
          return this.deleteUserDefinitionAttributeDefinitions();
        })
        .then(()=>{
            console.log("Create UserDef");
          return this.createUserDefinition();
        })
        .then(()=>{
            console.log("Del All Groups");
          return Group.deleteAll(this.jwt);                  
        })
        .then(()=>{
            console.log("Del All Users");
          return User.deleteAll(this.jwt);  
        })
        .then(()=>{
            console.log("Create Users");
          return this.createUsers();

        })
        .then(()=>{
            console.log("Create Groups");
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
