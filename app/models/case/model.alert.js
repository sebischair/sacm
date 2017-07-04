import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Alert extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/alerts', data);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/alerts');
  }

  static findByProcessId(jwt, processId) {
    return http.get(jwt, '/processes/'+processId+'/alerts');
  }

  static findById(jwt, alertId) {
    return http.get(jwt, '/alerts/'+alertId);
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/alerts/'+data.id, data);
  }

  static seen(jwt, alertId) {
    return http.post(jwt, '/alerts/'+alertId+'/seen');
  }

  static findByMe(jwt) {
    return http.get(jwt, '/alerts/me');
  }

}