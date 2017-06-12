import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Process extends Model{

  static findbyId(jwt, processId){
    return http.get(jwt, '/process/'+processId);
  }
  
  static findbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/processes');
  }

  static findAllbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/processes/all');
  }

  static findbyProcessDefinitionId(jwt, processDefinitionId){
    return http.get(jwt, '/processdefinition/'+processDefinitionId+'/processes');
  }

  static findbyStageId(jwt, stageId){
    return http.get(jwt, '/stage/'+stageId+'/processes');
  }
}