import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class EntityDefinition extends Model{

  static create(jwt, data){
    return http.post(jwt, '/workspaces/'+data.workspace+'/entityDefinitions', data);
  }

  static update(jwt, data){
    return http.put(jwt, '/entityDefinitions/'+data.id, data);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/entityDefinitions/');
  }
}
