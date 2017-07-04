import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class UserDefinition extends Model{

  static find(jwt) {
    return http.get(jwt, '/users/userdefinition');
  }
}