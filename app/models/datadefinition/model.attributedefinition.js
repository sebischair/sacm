import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AttributeDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/attributeDefinitions', data);
  }

  static deleteById(jwt, adttributeDefinitionId) {
    return http.del(jwt, '/attributeDefinitions/'+adttributeDefinitionId);
  }

}