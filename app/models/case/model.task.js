import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Task extends Model{

  static findById(jwt, taskId){
    return http.get(jwt, '/tasks/'+taskId);
  }
  
  static findByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/tasks');
  }

  static findAllByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/tasks/all');
  }

  static findByTaskDefinitionId(jwt, taskDefinitionId){
    return http.get(jwt, '/taskdefinitions/'+taskDefinitionId+'/tasks');
  }

  static findByStageId(jwt, stageId){
    return http.get(jwt, '/stages/'+stageId+'/tasks');
  }
}