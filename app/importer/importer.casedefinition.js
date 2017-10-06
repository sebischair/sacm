'use strict';
import Promise from 'bluebird';
import Importer from './importer';
import Workspace from '../models/workspace/model.workspace';


module.exports = class CaseDefinitionImporter extends Importer{

  constructor() {
    super();
  }

  importLocalFile(jwt, localFile, version){
    return this.parseXMLFile(localFile)
      .then(json=>{
        return this.import(jwt, json, version);
      });
  }

  importAttachedFile(jwt, attachedFile, version){
    return this.parseXMLString(attachedFile)
      .then(json=>{
        return this.import(jwt, json, version);
      });
  }

  import(jwt, json, version){ 
    this.version = version;
    this.jwt = jwt;  
    this.json = json.SACMDefinition;
    return this.initializeMaps()     
      .then(()=>{
        return this.initializeMapsWithWorkspace();
      })
      .then(()=>{
        if(this.json.Workspace == null)
          return Promise.reject('No Workspace defined in XML!');
        if(this.json.Workspace.length>1)
          return Promise.reject('Multiple Workspace defined in XML!');
        else
          return this.createWorkspaceElements(this.json.Workspace[0]);
      })
  }

  initializeMapsWithWorkspace(){
    if(this.json.Group != null)
      this.json.Group.forEach(g=>{
        this.groupMap.set(g.$.id, g.$.staticId);
      })
    if(this.json.User != null)
      this.json.User.forEach(u=>{
        this.userMap.set(u.$.id, u.$.staticId);
      })
    if(this.json.Workspace != null)
      this.json.Workspace.forEach(w=>{
        this.workspaceMap.set(w.$.id, w.$.staticId);
      })
    return Promise.resolve();
  }


   

}
