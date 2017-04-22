import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class CaseDefinition extends Model{

  static create(data){
    return http.post('/casedefinitions/', data);
  }

  static findById(caseDefinitionId){
    return http.get('/casedefinition/'+caseDefinitionId);
  }
  
  static findByWorkspaceId(workspaceId){    
    return http.get('/workspace/'+workspaceId+'/casedefinitions');
  }

  static findTreeById(caseDefinitionId){
    return http.get('/casedefinition/'+caseDefinitionId+'/tree');
  }

  static updateById(caseDefinitionId, data) {
    return http.del('/casedefinition/'+caseDefinitionId, data);
  }

  static deleteById(caseDefinitionId) {
    return http.del('/casedefinition/'+caseDefinitionId);
  }
  
}