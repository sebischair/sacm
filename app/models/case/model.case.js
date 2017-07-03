import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Case extends Model{

  static create(jwt, data){
    return http.post(jwt, '/cases/', data);
  }
  
  static findAll(jwt){
    return http.get(jwt, '/cases');
  }

  static findById(jwt, caseId){
    return http.get(jwt, '/case/'+caseId);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspace/'+workspaceId+'/cases');
  }

  static findbyCaseDefinitionId(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/cases');
  }

  static findTreeById(jwt, caseId, params){
    return http.get(jwt, '/case/'+caseId+'/tree', params);
  }

  static deleteById(jwt, caseId) {
    return http.del(jwt, '/case/'+caseId);
  }

  static complete(jwt, caseId) {
    return http.post(jwt, '/case/'+caseId+'/complete');
  }

  static terminate(jwt, caseId) {
    return http.post(jwt, '/case/'+caseId+'/terminate');
  }

  static permissions(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/permissions');
  }

  static readerAutocomplete(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/reader/autocomplete');
  }

  static addReader(jwt, caseId, principalId) {
    return http.post(jwt, '/case/'+caseId+'/reader/'+principalId);
  }

  static removeReader(jwt, caseId, principalId) {
    return http.del(jwt, '/case/'+caseId+'/reader/'+principalId);
  }

  static writerAutocomplete(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/writer/autocomplete');
  }

  static addWriter(jwt, caseId, principalId) {
    return http.post(jwt, '/case/'+caseId+'/writer/'+principalId);
  }

  static removeWriter(jwt, caseId, principalId) {
    return http.del(jwt, '/case/'+caseId+'/writer/'+principalId);
  }

  static findByMe(jwt) {
    return http.get(jwt, '/cases/me');
  }
}
