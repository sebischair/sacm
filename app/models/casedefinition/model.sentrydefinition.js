import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SentryDefinition extends Model{

  static create(jwt, data){
    return http.post(jwt, '/sentrydefinitions/', data);
  }

  static findById(jwt, sentryDefinitionId){
    return http.get(jwt, '/sentrydefinition/'+sentryDefinitionId);
  }

  static findByProcessDefinitionId(jwt, processDefinitionId) {
    return http.get(jwt, '/processdefinition/'+processDefinitionId+'/sentrydefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/sentrydefinition/'+data.id, data);
  }

  static deleteById(jwt, sentryDefinitionId) {
    return http.del(jwt, '/sentrydefinition/'+sentryDefinitionId);
  }
  
}