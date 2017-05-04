import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class User extends Model{

  static create(data) {
    return http.post('/users', data);
  }

}