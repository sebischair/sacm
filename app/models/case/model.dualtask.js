import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DualTask extends Model{

  static getResourceType(){
    return 'dualtasks';
  }
  
  static findById(jwt, dualTaskId) {
    return http.get(jwt, '/dualtasks/'+dualTaskId);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/dualtasks');
  }

  static findAllByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/dualtasks/all');
  }

  static findByStageId(jwt, stageId) {
    return http.get(jwt, '/stages/'+stageId+'/dualtasks');
  }

  static findByHumanTaskDefinitionId(jwt, humanTaskDefinitionId) {
    return http.get(jwt, '/humantaskdefinitions/'+humanTaskDefinitionId+'/dualtasks');
  }

  static activate(jwt, dualTaskId) {
    return http.post(jwt, '/dualtasks/'+dualTaskId+'/activate');
  }

  static draftHumanPart(jwt, data) {
    return http.post(jwt, '/dualtasks/'+data.id+'/humanpart/draft', data);
  }

  static draftAutomatedPart(jwt, data) {
    return http.post(jwt, '/dualtasks/'+data.id+'/automatedpart/draft', data);
  }

  static completeHumanPart(jwt, data) {
    return http.post(jwt, '/dualtasks/'+data.id+'/humanpart/complete', data);
  }

  static completeAutomatedPart(jwt, data) {
    return http.post(jwt, '/dualtasks/'+data.id+'/automatedpart/complete', data);
  }

  static terminate(jwt, dualTaskId) {
    return http.post(jwt, '/dualtasks/'+dualTaskId+'/terminate');
  }

  static setOwner(jwt, dualTaskId, userId){
    return http.post(jwt, '/dualtasks/'+dualTaskId+'/owner/'+userId);
  }

  static setDueDate(jwt, dualTaskId, dueDate){
    return http.post(jwt, '/dualtasks/'+dualTaskId+'/duedate', {dueDate: dueDate});
  }

  static setExternalId(jwt, dualTaskId, externalId){
    return http.post(jwt, '/dualtasks/'+dualTaskId+'/externalid/'+externalId);
  }

  static findMeActive(jwt) {
    return http.get(jwt, '/dualtasks/me/active');
  }

  static findMeActiveByWorkspaceId(jwt, workspaceId) {
    return http.get(jwt, '/workspaces/'+workspaceId+'/dualtasks/me/active');
  }


}