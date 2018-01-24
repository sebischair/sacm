import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DualTaskDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/dualtaskdefinitions/', data);
  }

  static findById(jwt, dualTaskDefinitionId) {
    return http.get(jwt, '/dualtaskdefinitions/'+dualTaskDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/dualtaskdefinitions');
  }

  static findAllByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/dualtaskdefinitions/all');
  }

  static findByStageDefinitionId(jwt, stageDefinitionId) {
    return http.get(jwt, '/stagedefinitions/'+stageDefinitionId+'/dualtaskdefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/dualtaskdefinitions/'+data.id, data);
  }

  static deleteById(jwt, dualTaskDefinitionId) {
    return http.del(jwt, '/dualtaskdefinitions/'+dualTaskDefinitionId);
  }
  
}