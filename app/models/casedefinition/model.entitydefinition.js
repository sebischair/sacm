import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class EntityDefinition extends Model{

  static create(workspaceId, typeName){
    var data = {
      name: typeName,
      namePlural: typeName,
      workspace: workspaceId
    };
    return http.post('/workspaces/'+workspaceId+'/entityDefinitions', data);
  }

//TODO this schould replace the old method
  static create2(data){
    return http.post('/workspaces/'+data.workspace+'/entityDefinitions', data);
  }


  static findByWorkspaceId(workspaceId){
    return http.get('/workspaces/'+workspaceId+'/entityDefinitions/');
  }
}
