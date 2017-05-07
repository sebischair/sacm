import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Stage extends Model{

  static findbyId(stageId){
    return http.get('/stage/'+stageId);
  }
  
  static findbyCaseId(caseId){
    return http.get('/case/'+caseId+'/stages');
  }

  static findAllbyCaseId(caseId){
    return http.get('/case/'+caseId+'/stages/all');
  }

  static findbyStageDefinitionId(stageDefinitionId){
    return http.get('/stagedefinition/'+stageDefinitionId+'/stages');
  }

  static findbyStageId(stageId){
    return http.get('/stage/'+stageId+'/stages');
  }
  
  static complete(stageId){
    return http.post('/stage/'+stageId+'/complete');
  }

  static terminate(stageId){
    return http.post('/stage/'+stageId+'/terminate');
  }

}