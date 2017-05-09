import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class StageDefinition extends Model{

  static create(data) {
    return http.post('/stagedefinitions/', data);
  }

  static findById(stageDefinitionId) {
    return http.get('/stagedefinition/'+stageDefinitionId);
  }

  static findByCaseDefinitionId(caseDefinitionId) {
    return http.get('/casedefinition/'+caseDefinitionId+'/stagedefinitions');
  }

  static findALLByCaseDefinitionId(caseDefinitionId) {
    return http.get('/casedefinition/'+caseDefinitionId+'/stagedefinitions/all');
  }

  static updateById(stageDefinitionId, data) {
    return http.del('/stagedefinition/'+stageDefinitionId, data);
  }

  static deleteById(stageDefinitionId) {
    return http.del('/stagedefinition/'+stageDefinitionId);
  }
  
}