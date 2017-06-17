import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Attribute extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/attributes', data);
  }

  static autocompleteById(jwt, attributeId) {
    return http.get(jwt, '/attributes/'+attributeId+'/autocomplete');
  }

}