import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTaskDefinition extends Model{

  static create(data) {
    return http.post('/humantaskdefinitions/', data);
  }

  static findById(humanTaskDefinitionId) {
    return http.get('/humantaskdefinition/'+humanTaskDefinitionId);
  }

  static findByCaseDefinitionId(caseDefinitionId) {
    return http.get('/casedefinition/'+caseDefinitionId+'/humantaskdefinitions');
  }

  static findByStageDefinitionId(stageDefinitionId) {
    return http.get('/stagedefinition/'+stageDefinitionId+'/humantaskdefinitions');
  }

  static updateById(humanTaskDefinitionId) {
    return http.put('/humantaskdefinition/'+humanTaskDefinitionId, data);
  }

  static deleteById(humanTaskDefinitionId) {
    return http.del('/humantaskdefinition/'+humanTaskDefinitionId);
  }
  
}