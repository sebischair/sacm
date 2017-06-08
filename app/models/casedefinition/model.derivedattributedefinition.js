import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DerivedAttributeDefinition extends Model{

  static create(definition) {
    return http.post('/derivedAttributeDefinitions', definition);
  }

  static deletById(id) {
    return http.del('/derivedAttributeDefinition/'+id);
  }

  
}