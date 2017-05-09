import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTaskDefinition extends Model{

  static create(data) {
    return http.post('/automatedtaskdefinitions/', data);
  }

  static findById(automatedTaskDefinitionId) {
    return http.get('/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }

  static findByCaseDefinitionId(caseDefinitionId) {
    return http.get('/casedefinition/'+caseDefinitionId+'/automatedtaskdefinitions');
  }

  static findAllByCaseDefinitionId(caseDefinitionId) {
    return http.get('/casedefinition/'+caseDefinitionId+'/automatedtaskdefinitions/all');
  }

  static findByStageDefinitionId(stageDefinitionId) {
    return http.get('/stagedefinition/'+stageDefinitionId+'/automatedtaskdefinitions');
  }

  static updateById(automatedTaskDefinitionId, data) {
    return http.put('/automatedtaskdefinition/'+automatedTaskDefinitionId, data);
  }

  static deleteById(automatedTaskDefinitionId) {
    return http.del('/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }
  
}