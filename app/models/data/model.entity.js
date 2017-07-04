import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Entity extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/entities', data);
  }

  static findById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId);
  }

  static findDeepLinksById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId+'/deeplinks');
  }
  

}