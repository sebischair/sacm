import Promise from 'bluebird';
import http from './http';
import Model from './model';


export default class Context extends Model{

  static info(jwt){
    return http.get(jwt, '');
  }
}