import mongoose from 'mongoose';
import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class EntityDefinition extends Model{

  static create(workspaceId, typeName){
    var data = {
      name: typeName, 
      namePlural: typeName, 
      workspace: {id: workspaceId}
    };
    return http.post('/workspaces/'+workspaceId+'/entityTypes', data);
  }

  static findByWorkspaceId(workspaceId){
    return http.get('/workspaces/'+workspaceId+'/entityTypes/');
  }
}