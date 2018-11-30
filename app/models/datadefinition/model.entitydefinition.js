import Promise from 'bluebird';
import http from '../http';
import Model from '../model';

export default class EntityDefinition extends Model{

  static create(jwt, data){
    if(data && !data.description)
      return Model.error('EntityDefinition description missing!', "No description found for '" + data.name + "'!");
    else
      return http.post(jwt, '/workspaces/'+data.workspace+'/entityDefinitions', data);
  }

  static update(jwt, data){
    return http.put(jwt, '/entityDefinitions/'+data.id, data);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/entityDefinitions/');
  }
}
