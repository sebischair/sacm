import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Task extends Model{

  static findbyId(jwt, taskId){
    return http.get(jwt, '/task/'+taskId);
  }
  
  static findbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/tasks');
  }

  static findAllbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/tasks/all');
  }

  static findbyTaskDefinitionId(jwt, taskDefinitionId){
    return http.get(jwt, '/taskdefinition/'+taskDefinitionId+'/tasks');
  }

  static findbyStageId(jwt, stageId){
    return http.get(jwt, '/stage/'+stageId+'/tasks');
  }
}