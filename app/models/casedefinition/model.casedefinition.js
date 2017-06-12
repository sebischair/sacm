import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class CaseDefinition extends Model{

  static canInstantiate(jwt){
    return http.get(jwt, '/casedefinitions/caninstantiate');
  }

  static create(jwt, data){
    return http.post(jwt, '/casedefinitions/', data);
  }

  static findById(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinition/'+caseDefinitionId);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspace/'+workspaceId+'/casedefinitions');
  }

  static findTreeById(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/tree');
  }

  static updateById(jwt, caseDefinitionId, data) {
    return http.put(jwt, '/casedefinition/'+caseDefinitionId, data);
  }

  static deleteById(jwt, caseDefinitionId) {
    return http.del(jwt, '/casedefinition/'+caseDefinitionId);
  }

}
