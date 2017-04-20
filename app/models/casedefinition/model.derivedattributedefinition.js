import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class DerivedAttributeDefinition extends Model{

  static create(typeId, definition) {
    return http.post('/entityTypes/'+typeId+'/derivedAttributeDefinitions', definition);
  }

  
}