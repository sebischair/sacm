import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTaskDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/automatedtaskdefinitions/', data);
  }

  static findById(jwt, automatedTaskDefinitionId) {
    return http.get(jwt, '/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/automatedtaskdefinitions');
  }

  static findAllByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/automatedtaskdefinitions/all');
  }

  static findByStageDefinitionId(jwt, stageDefinitionId) {
    return http.get(jwt, '/stagedefinition/'+stageDefinitionId+'/automatedtaskdefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/automatedtaskdefinition/'+data.id, data);
  }

  static deleteById(jwt, automatedTaskDefinitionId) {
    return http.del(jwt, '/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }
  
}