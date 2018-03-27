import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class CaseDefinition extends Model{

  static canInstantiate(jwt){
    return http.get(jwt, '/casedefinitions/caninstantiate');
  }

  static canInstantiateByWorkspace(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/casedefinitions/caninstantiate');
  }

  static disableInstantiation(jwt, caseDefinitionId){
    return http.post(jwt, '/casedefinitions/'+caseDefinitionId+'/disableinstantiation');
  }

  static create(jwt, data){
    return http.post(jwt, '/casedefinitions/', data);
  }

  static findById(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/casedefinitions');
  }

  static findTreeById(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/tree');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/casedefinitions/'+data.id, data);
  }

  static deleteById(jwt, caseDefinitionId) {
    return http.del(jwt, '/casedefinitions/'+caseDefinitionId);
  }

  static versions(jwt) {
    return http.get(jwt, '/casedefinitions/versions');
  }

}
