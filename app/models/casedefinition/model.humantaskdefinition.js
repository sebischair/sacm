import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTaskDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/humantaskdefinitions/', data);
  }

  static findById(jwt, humanTaskDefinitionId) {
    return http.get(jwt, '/humantaskdefinitions/'+humanTaskDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/humantaskdefinitions');
  }

  static findAllByCaseDefinitionId(jwt, caseDefinitionId) {
    return http.get(jwt, '/casedefinitions/'+caseDefinitionId+'/humantaskdefinitions/all');
  }

  static findByStageDefinitionId(jwt, stageDefinitionId) {
    return http.get(jwt, '/stagedefinitions/'+stageDefinitionId+'/humantaskdefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/humantaskdefinitions/'+data.id, data);
  }

  static deleteById(jwt, humanTaskDefinitionId) {
    return http.del(jwt, '/humantaskdefinitions/'+humanTaskDefinitionId);
  }
  
}