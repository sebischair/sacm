import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class EntityDefinition extends Model{

  static create(jwt, workspaceId, typeName){
    var data = {
      name: typeName,
      namePlural: typeName,
      workspace: workspaceId
    };
    return http.post(jwt, '/workspaces/'+workspaceId+'/entityDefinitions', data);
  }

//TODO this schould replace the old method
  static create2(jwt, data){
    return http.post(jwt, '/workspaces/'+data.workspace+'/entityDefinitions', data);
  }


  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/entityDefinitions/');
  }
}
