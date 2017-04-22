import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SentryDefinition extends Model{

  static create(data){
    return http.post('/sentrydefinitions/', data);
  }

  static findById(sentryDefinitionId){
    return http.get('/sentrydefinition/'+sentryDefinitionId);
  }

  static findByProcessDefinitionId(processDefinitionId) {
    return http.get('/processdefinition/'+processDefinitionId+'/sentrydefinitions');
  }

  static updateById(sentryDefinitionId, data) {
    return http.put('/sentrydefinition/'+sentryDefinitionId, data);
  }

  static deleteById(sentryDefinitionId) {
    return http.del('/sentrydefinition/'+sentryDefinitionId);
  }
  
}