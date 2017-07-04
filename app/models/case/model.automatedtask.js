import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTask extends Model{

  static findById(jwt, automatedTaskId) {
    return http.get(jwt, '/automatedtask/'+automatedTaskId);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/automatedtasks');
  }

  static findAllByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/automatedtasks/all');
  }

  static findByStageId(jwt, stageId) {
    return http.get(jwt, '/stage/'+stageId+'/automatedtasks');
  }

  static findByAutomatedTaskDefinitionId(jwt, automatedTaskDefinitionId) {
    return http.get(jwt, '/automatedtaskdefinition/'+automatedTaskDefinitionId+'/automatedtasks');
  }

  static activate(jwt, automatedTaskId) {
    return http.post(jwt, '/automatedtask/'+dautomatedTaskId+'/activate');
  }

  static draft(jwt, data) {
    return http.post(jwt, '/automatedtask/'+data.id+'/draft', data);
  }

  static complete(jwt, data) {
    return http.post(jwt, '/automatedtask/'+data.id+'/complete', data);
  }

  static terminate(jwt, automatedTaskId) {
    return http.post(jwt, '/automatedtask/'+automatedTaskId+'/terminate');
  }

  static setOwner(jwt, automatedtaskId, userId){
    return http.post(jwt, '/automatedtask/'+automatedtaskId+'/owner/'+userId);
  }

}