import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AttributeDefinition extends Model{

  static create(typeId, definition) {
    const data = {
        name: definition.name,
        attributeType: definition.attributeType,
        options: definition.options,
        multiplicity: definition.multiplicity
    };
    return http.post('/entityTypes/'+typeId+'/attributeDefinitions', data);
  }

}