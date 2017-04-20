import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SentryDefinition extends Model{

  static create(data){
    return http.post('/sentrydefinitions/', data);
  }

  static findAll() {
    return http.get('/sentrydefinitions/');
  }

  static findById(sentryDefinitionId){
    return http.get('/sentrydefinition/'+sentryDefinitionId);
  }

  static deleteById(sentryDefinitionId) {
    return http.del('/sentrydefinition/'+sentryDefinitionId);
  }
  
}