import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DerivedAttributeDefinition extends Model{

  static create(jwt, definition) {
    return http.post(jwt, '/derivedAttributeDefinitions', definition);
  }

  static deleteById(jwt, id) {
    return http.del(jwt, '/derivedAttributeDefinitions/'+id);
  }

  
}