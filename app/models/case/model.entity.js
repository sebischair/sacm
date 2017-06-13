import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Attribute extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/entities', data);
  }

  static findById(jwt, entityId){
    console.log('here')
    return http.get(jwt, '/caseentity/'+entityId);
  }

  static findDeepLinksById(jwt, entityId){
    console.log('here')
    return http.get(jwt, '/caseentity/'+entityId+'/deeplinks');
  }
  

}