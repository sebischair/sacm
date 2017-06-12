import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class StageDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/stagedefinitions/', data);
  }

  static findById(jwt, stageDefinitionId) {
    return http.get(jwt, '/stagedefinition/'+stageDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/stagedefinitions');
  }

  static findALLByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/stagedefinitions/all');
  }

  static updateById(jwt, stageDefinitionId, data) {
    return http.del(jwt, '/stagedefinition/'+stageDefinitionId, data);
  }

  static deleteById(jwt, stageDefinitionId) {
    return http.del(jwt, '/stagedefinition/'+stageDefinitionId);
  }
  
}