import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Tenant extends Model{


  static findAll(jwt) {
    return http.get(jwt, '/tenants');
  }




}
