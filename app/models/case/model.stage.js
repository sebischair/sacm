import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Stage extends Model{

  static findById(jwt, stageId){
    return http.get(jwt, '/stage/'+stageId);
  }
  
  static findByCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/stages');
  }

  static findAllbyCaseId(jwt, caseId){
    return http.get(jwt, '/case/'+caseId+'/stages/all');
  }

  static findbyStageDefinitionId(jwt, stageDefinitionId){
    return http.get(jwt, '/stagedefinition/'+stageDefinitionId+'/stages');
  }

  static findByStageId(jwt, stageId){
    return http.get(jwt, '/stage/'+stageId+'/stages');
  }
  
  static complete(jwt, stageId){
    return http.post(jwt, '/stage/'+stageId+'/complete');
  }

  static terminate(jwt, stageId){
    return http.post(jwt, '/stage/'+stageId+'/terminate');
  }

  static setOwner(jwt, stageId, userId){
    return http.post(jwt, '/stage/'+stageId+'/owner/'+userId);
  }

}