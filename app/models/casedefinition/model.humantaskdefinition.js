import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTaskDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/humantaskdefinitions/', data);
  }

  static findById(jwt, humanTaskDefinitionId) {
    return http.get(jwt, '/humantaskdefinition/'+humanTaskDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/humantaskdefinitions');
  }

  static findAllByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinition/'+caseDefinitionId+'/humantaskdefinitions/all');
  }

  static findByStageDefinitionId(jwt, stageDefinitionId) {
    return http.get(jwt, '/stagedefinition/'+stageDefinitionId+'/humantaskdefinitions');
  }

  static updateById(jwt, humanTaskDefinitionId, data) {
    return http.put(jwt, '/humantaskdefinition/'+humanTaskDefinitionId, data);
  }

  static deleteById(jwt, humanTaskDefinitionId) {
    return http.del(jwt, '/humantaskdefinition/'+humanTaskDefinitionId);
  }
  
}