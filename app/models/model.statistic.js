import Promise from 'bluebird';
import http from './http';
import Model from './model';


export default class Statistic extends Model{

  static info(jwt){
    return http.get(jwt, '/statistics');
  }
}