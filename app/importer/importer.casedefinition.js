'use strict';
import Promise from 'bluebird';
import Importer from './importer';
import Workspace from '../models/workspace/model.workspace';


module.exports = class CaseDefinitionImporter extends Importer{

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
        return this.createWorkspaces();
      })
      .then(()=>{
        return Workspace.findAll(this.jwt);
      });   
  }


   

}
