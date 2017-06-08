import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DerivedAttributeDefinition extends Model{

  static create(definition) {
    return http.post('/derivedAttributeDefinitions', definition);
  }

  static deleteById(id) {
    return http.del('/derivedAttributeDefinitions/'+id);
  }

  
}