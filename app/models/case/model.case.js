import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Case extends Model{

  static create(data){
    return http.post('/cases/', data);
  }
 
  static findbyId(caseId){
    return http.get('/case/'+caseId);
  }

  static findbyWorkspaceId(workspaceId){
    return http.get('/workspace/'+workspaceId+'/cases');
  }

  static findbyCaseDefinitionId(caseDefinitionId){
    return http.get('/casedefinition/'+caseDefinitionId+'/cases');
  }

  static findTreebyId(caseId){
    return http.get('/case/'+caseId+'/tree');
  }

  static deleteById(caseId) {
    return http.del('/case/'+caseId);
  }

  static complete(caseId) {
    return http.post('/case/'+caseId+'/complete');
  }

  static terminate(caseId) {
    return http.post('/case/'+caseId+'/terminate');
  }

  static permissions(caseId) {
    return http.get('/case/'+caseId+'/permissions');
  }

  static addReader(caseId, principalId) {
    return http.post('/case/'+caseId+'/reader/'+principalId);
  }

  static removeReader(caseId, principalId) {
    return http.del('/case/'+caseId+'/reader/'+principalId);
  }
   
  static addWriter(caseId, principalId) {
    return http.post('/case/'+caseId+'/writer/'+principalId);
  }

  static removeWriter(caseId, principalId) {
    return http.del('/case/'+caseId+'/writer/'+principalId);
  }
}