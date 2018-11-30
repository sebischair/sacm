import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AttributeDefinition extends Model{

  static create(jwt, data) {
    if(data && !data.description)
      return Model.error('AttributeDefinition description missing!', "No description found for '" + data.name + "'!");
    else
      return http.post(jwt, '/attributeDefinitions', data);
  }

  static deleteById(jwt, adttributeDefinitionId) {
    return http.del(jwt, '/attributeDefinitions/'+adttributeDefinitionId);
  }

}