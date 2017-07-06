import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Log extends Model{

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/logs');
  }

  static findByProcessId(jwt, processId) {
    return http.get(jwt, '/processes/'+processId+'/logs');
  }

}