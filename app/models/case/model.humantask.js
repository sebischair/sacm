import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTask extends Model{
  
  static findById(jwt, humanTaskId) {
    return http.get(jwt, '/humantask/'+humanTaskId);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/humantasks');
  }

  static findAllByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/humantasks/all');
  }

  static findByStageId(jwt, stageId) {
    return http.get(jwt, '/stage/'+stageId+'/humantasks');
  }

  static findByHumanTaskDefinitionId(jwt, humanTaskDefinitionId) {
    return http.get(jwt, '/humantaskdefinition/'+humanTaskDefinitionId+'/humantasks');
  }

  static draft(jwt, data) {
    return http.post(jwt, '/humantask/'+data.id+'/draft', data);
  }

  static complete(jwt, data) {
    return http.post(jwt, '/humantask/'+data.id+'/complete', data);
  }

  static terminate(jwt, humanTaskId) {
    return http.post(jwt, '/humantask/'+humanTaskId+'/terminate');
  }

  static setOwner(jwt, humanTaskId, userId){
    return http.post(jwt, '/humantask/'+humanTaskId+'/owner/'+userId);
  }


}