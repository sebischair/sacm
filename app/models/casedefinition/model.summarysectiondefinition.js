import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SummarySectionDefinition extends Model{

  static create(data){
    return http.post('/summarysectiondefinitions/', data);
  }

  static findById(summarySectionDefinitionId){
    return http.get('/summarysectiondefinition/'+summarySectionDefinitionId);
  }

  static findByCaseDefinitionId(caseDefinitionId){
    return http.get('/caseDefinitions/'+caseDefinitionId+'/summarysectiondefinitions');
  }

  static updateById(data) {
    return http.put('/summarysectiondefinition/'+data.id, data);
  }

  static deleteById(summarySectionDefinitionId) {
    return http.del('/summarysectiondefinition/'+summarySectionDefinitionId);
  }

}
