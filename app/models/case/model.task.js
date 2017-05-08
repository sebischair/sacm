import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Task extends Model{

  static findbyId(taskId){
    return http.get('/task/'+taskId);
  }
  
  static findbyCaseId(caseId){
    return http.get('/case/'+caseId+'/tasks');
  }

  static findAllbyCaseId(caseId){
    return http.get('/case/'+caseId+'/tasks/all');
  }

  static findbyTaskDefinitionId(taskDefinitionId){
    return http.get('/taskdefinition/'+taskDefinitionId+'/tasks');
  }

  static findbyStageId(stageId){
    return http.get('/stage/'+stageId+'/tasks');
  }
}