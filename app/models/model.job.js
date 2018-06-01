import Promise from 'bluebird';
import http from './http';
import Model from './model';


export default class Job extends Model{

  static triggerCompleteOn(jwt){
    return http.post(jwt, '/jobs/completeon/trigger');
  }
}