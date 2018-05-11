import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTask extends Model{

  static getResourceType(){
    return 'automatedtasks';
  }

  static findById(jwt, automatedTaskId) {
    return http.get(jwt, '/automatedtasks/'+automatedTaskId);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/automatedtasks');
  }

  static findAllByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/automatedtasks/all');
  }

  static findByStageId(jwt, stageId) {
    return http.get(jwt, '/stages/'+stageId+'/automatedtasks');
  }

  static findByAutomatedTaskDefinitionId(jwt, automatedTaskDefinitionId) {
    return http.get(jwt, '/automatedtaskdefinitions/'+automatedTaskDefinitionId+'/automatedtasks');
  }

  static activate(jwt, automatedTaskId) {
    return http.post(jwt, '/automatedtasks/'+dautomatedTaskId+'/activate');
  }

  static draft(jwt, data) {
    return http.post(jwt, '/automatedtasks/'+data.id+'/draft', data);
  }

  static complete(jwt, data) {
    return http.post(jwt, '/automatedtasks/'+data.id+'/complete', data);
  }

  static terminate(jwt, automatedTaskId) {
    return http.post(jwt, '/automatedtasks/'+automatedTaskId+'/terminate');
  }

  static setOwner(jwt, automatedtaskId, userId){
    return http.post(jwt, '/automatedtasks/'+automatedtaskId+'/owner/'+userId);
  }

  static setExternalId(jwt, automatedtaskId, externalId){
    return http.post(jwt, '/automatedtasks/'+automatedtaskId+'/externalid/'+externalId);
  }

}