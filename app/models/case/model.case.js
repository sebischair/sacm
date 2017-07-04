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
    return http.get(jwt, '/cases/'+caseId);
  }

  static findByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/cases');
  }

  static findbyCaseDefinitionId(jwt, caseDefinitionId){
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/cases');
  }

  static findTreeById(jwt, caseId, params){
    return http.get(jwt, '/cases/'+caseId+'/tree', params);
  }

  static deleteById(jwt, caseId) {
    return http.del(jwt, '/cases/'+caseId);
  }

  static complete(jwt, caseId) {
    return http.post(jwt, '/cases/'+caseId+'/complete');
  }

  static terminate(jwt, caseId) {
    return http.post(jwt, '/cases/'+caseId+'/terminate');
  }

  static permissions(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/permissions');
  }

  static readerAutocomplete(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/reader/autocomplete');
  }

  static addReader(jwt, caseId, principalId) {
    return http.post(jwt, '/cases/'+caseId+'/reader/'+principalId);
  }

  static removeReader(jwt, caseId, principalId) {
    return http.del(jwt, '/cases/'+caseId+'/reader/'+principalId);
  }

  static writerAutocomplete(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/writer/autocomplete');
  }

  static addWriter(jwt, caseId, principalId) {
    return http.post(jwt, '/cases/'+caseId+'/writer/'+principalId);
  }

  static removeWriter(jwt, caseId, principalId) {
    return http.del(jwt, '/cases/'+caseId+'/writer/'+principalId);
  }

  static findByMe(jwt) {
    return http.get(jwt, '/cases/me');
  }
}
