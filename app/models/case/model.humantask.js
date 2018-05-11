import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTask extends Model{
  
  static getResourceType(){
    return 'humantasks';
  }  

  static findById(jwt, humanTaskId) {
    return http.get(jwt, '/humantasks/'+humanTaskId);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/humantasks');
  }

  static findAllByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/humantasks/all');
  }

  static findByStageId(jwt, stageId) {
    return http.get(jwt, '/stages/'+stageId+'/humantasks');
  }

  static findByHumanTaskDefinitionId(jwt, humanTaskDefinitionId) {
    return http.get(jwt, '/humantaskdefinitions/'+humanTaskDefinitionId+'/humantasks');
  }

  static activate(jwt, humanTaskId) {
    return http.post(jwt, '/humantasks/'+humanTaskId+'/activate');
  }

  static draft(jwt, data) {
    return http.post(jwt, '/humantasks/'+data.id+'/draft', data);
  }

  static complete(jwt, data) {
    return http.post(jwt, '/humantasks/'+data.id+'/complete', data);
  }

  static terminate(jwt, humanTaskId) {
    return http.post(jwt, '/humantasks/'+humanTaskId+'/terminate');
  }

  static setOwner(jwt, humanTaskId, userId){
    return http.post(jwt, '/humantasks/'+humanTaskId+'/owner/'+userId);
  }

  static setDueDate(jwt, humanTaskId, dueDate){
    return http.post(jwt, '/humantasks/'+humanTaskId+'/duedate', {dueDate: dueDate});
  }

  static setExternalId(jwt, humanTaskId, externalId){
    return http.post(jwt, '/humantasks/'+humanTaskId+'/externalid/'+externalId);
  }

  static findMeActive(jwt) {
    return http.get(jwt, '/humantasks/me/active');
  }

  static findMeActiveByWorkspaceId(jwt, workspaceId) {
    return http.get(jwt, '/workspaces/'+workspaceId+'/humantasks/me/active');
  }


}