import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Alert extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/alerts', data);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/alerts');
  }

  static findByProcessId(jwt, processId) {
    return http.get(jwt, '/process/'+processId+'/alerts');
  }

  static findById(jwt, alertId) {
    return http.get(jwt, '/alert/'+alertId);
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/alert/'+data.id, data);
  }

  static seen(jwt, alertId) {
    return http.post(jwt, '/alert/'+alertId+'/seen');
  }

  static findByMe(jwt) {
    return http.get(jwt, '/alerts/me');
  }

}