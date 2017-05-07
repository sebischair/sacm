import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTask extends Model{
  
  static findById(humanTaskId) {
    return http.get('/humantask/'+humanTaskId);
  }

  static findByCaseId(caseId) {
    return http.get('/case/'+caseId+'/humantasks');
  }

  static findByStageId(stageId) {
    return http.get('/stage/'+stageId+'/humantasks');
  }

  static findByHumanTaskDefinitionId(humanTaskDefinitionId) {
    return http.get('/humantaskdefinition/'+humanTaskDefinitionId+'/humantasks');
  }

  static complete(data) {
    return http.post('/humantask/'+data.id+'/complete', data);
  }

  static terminate(humanTaskId) {
    return http.post('/humantask/'+humanTaskId+'/terminate');
  }


}