import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class CaseDefinition extends Model{

  static create(data){
    return http.post('/casedefinitions/', data);
  }

  static findByWorkspaceId(workspaceId){    
    return http.get('/workspaces/'+workspaceId+'/casedefinitions');
  }

  static findById(caseDefinitionId){
    return http.get('/casedefinition/'+caseDefinitionId);
  }

  static deleteById(caseDefinitionId) {
    return http.del('/casedefinition/'+caseDefinitionId);
  }
  
}