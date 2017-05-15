import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class UserDefinition extends Model{

  static find() {
    return http.get('/user/userType');
  }
}