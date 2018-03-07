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

  static findAllByWorkspaceId(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId+'/cases');
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

  static notes(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/notes');
  }

  static updateNotes(jwt, caseId, data) {
    return http.put(jwt, '/cases/'+caseId+'/notes', data);
  }

  static findMe(jwt) {
    return http.get(jwt, '/cases/me');
  }

  static findMeByWorkspace(jwt, workspaceId) {
    return http.get(jwt, '/workspaces/'+workspaceId+'/cases/me');
  }

  static setOwner(jwt, caseId, userId){
    return http.post(jwt, '/cases/'+caseId+'/owner/'+userId);
  }

  static autocompleteOwner(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/owner/autocomplete');
  }

  static findClientCasesByWorkspace(jwt, workspaceId, query){
    return http.get(jwt, '/workspaces/'+workspaceId+'/cases/client/search?query='+query);
  }

  static addUiVisibility(children, isParentVisible){
    children.forEach(child => {
      child.forEach(iteration => {
        if(iteration.isManualActivation === true){
          let state = iteration.state;
          let wasActive = iteration.stateTransitions.ACTIVE.DATE !== null
          iteration.uiVisibility = isParentVisible && (state === 'ACTIVE' || state === 'COMPLETED' || (wasActive && state === 'TERMINATED'));
        }else{
          iteration.uiVisibility = isParentVisible;
        }
        if(iteration.children)
          this.addUiVisibility(iteration.children, iteration.uiVisibility);
      });
    });
  }
}
