import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTask extends Model{

  static findById(automatedTaskId) {
    return http.get('/automatedtask/'+automatedTaskId);
  }

  static findByCaseId(caseId) {
    return http.get('/case/'+caseId+'/automatedtasks');
  }

  static findAllByCaseId(caseId) {
    return http.get('/case/'+caseId+'/automatedtasks/all');
  }

  static findByStageId(stageId) {
    return http.get('/stage/'+stageId+'/automatedtasks');
  }

  static findByAutomatedTaskDefinitionId(automatedTaskDefinitionId) {
    return http.get('/automatedtaskdefinition/'+automatedTaskDefinitionId+'/automatedtasks');
  }

}