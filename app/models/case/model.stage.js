import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Stage extends Model{

  static getResourceType(){
    return 'stages';
  }  

  static findById(jwt, stageId){
    return http.get(jwt, '/stages/'+stageId);
  }
  
  static findByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/stages');
  }

  static findAllByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/stages/all');
  }

  static findbyStageDefinitionId(jwt, stageDefinitionId){
    return http.get(jwt, '/stagedefinitions/'+stageDefinitionId+'/stages');
  }

  static findByStageId(jwt, stageId){
    return http.get(jwt, '/stages/'+stageId+'/stages');
  }

  static activate(jwt, stageId) {
    return http.post(jwt, '/stages/'+stageId+'/activate');
  }
  
  static complete(jwt, stageId){
    return http.post(jwt, '/stages/'+stageId+'/complete');
  }

  static terminate(jwt, stageId){
    return http.post(jwt, '/stages/'+stageId+'/terminate');
  }

  static setOwner(jwt, stageId, userId){
    return http.post(jwt, '/stages/'+stageId+'/owner/'+userId);
  }

  static setExternalId(jwt, stageId, externalId, data){
    return http.post(jwt, '/stages/'+stageId+'/externalid/'+externalId, data);
  }

}