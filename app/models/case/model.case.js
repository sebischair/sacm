import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Case extends Model{

  static create(data){
    return http.post('/cases/', data);
  }

  static findById(caseId){
    return http.get('/case/'+caseId);
  }

  static findByWorkspaceId(workspaceId){
    return http.get('/workspace/'+workspaceId+'/cases');
  }

  static findbyCaseDefinitionId(caseDefinitionId){
    return http.get('/casedefinition/'+caseDefinitionId+'/cases');
  }

  static findTreeById(caseId, params){
    return http.get('/case/'+caseId+'/tree', params);
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

  static findByMe() {
    return http.get('/cases/me');
  }
}
