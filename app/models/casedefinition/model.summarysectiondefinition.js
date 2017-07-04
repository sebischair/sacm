import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SummarySectionDefinition extends Model{

  static create(jwt, data){
    return http.post(jwt, '/summarysectiondefinitions/', data);
  }

  static findById(jwt, summarySectionDefinitionId){
    return http.get(jwt, '/summarysectiondefinitions/'+summarySectionDefinitionId);
  }

  static findByCaseDefinitionId(jwt, caseDefinitionId){
    return http.get(jwt, '/caseDefinitions/'+caseDefinitionId+'/summarysectiondefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/summarysectiondefinitions/'+data.id, data);
  }

  static deleteById(jwt, summarySectionDefinitionId) {
    return http.del(jwt, '/summarysectiondefinitions/'+summarySectionDefinitionId);
  }

}
