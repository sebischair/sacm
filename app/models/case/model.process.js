import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Process extends Model{

  static findbyId(processId){
    return http.get('/process/'+processId);
  }
  
  static findbyCaseId(caseId){
    return http.get('/case/'+caseId+'/processes');
  }

  static findbyProcessDefinitionId(processDefinitionId){
    return http.get('/processdefinition/'+processDefinitionId+'/processes');
  }

  static findbyStageId(stageId){
    return http.get('/stage/'+stageId+'/processes');
  }
}