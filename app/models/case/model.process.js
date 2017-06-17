import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Process extends Model{

  static findById(jwt, processId){
    return http.get(jwt, '/process/'+processId);
  }
  
  static findByCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/processes');
  }

  static findAllbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/processes/all');
  }

  static findByProcessDefinitionId(jwt, processDefinitionId){
    return http.get(jwt, '/processdefinition/'+processDefinitionId+'/processes');
  }

  static findByStageId(jwt, stageId){
    return http.get(jwt, '/stage/'+stageId+'/processes');
  }
}