import Promise from 'bluebird';
import http from '../http';
import Model from '../model';

// Status: Implementd
export default class Stage extends Model{

  static findbyCaseId(caseId){
    return http.get('/case/'+caseId+'/stages');
  }
  
  static findbyId(stageId){
    return http.get('/stage/'+stageId);
  }

  static complete(stageId){
    return http.get('/stage/'+stageId+'/complete');
  }

  static terminate(stageId){
    return http.get('/stage/'+stageId+'/terminate');
  }

}