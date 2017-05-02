import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AttributeDefinition extends Model{

  static create(data) {
    return http.post('/attributeDefinitions', data);
  }

}