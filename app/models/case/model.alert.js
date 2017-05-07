import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Alert extends Model{

  static create(data) {
    return http.post('/alerts', data);
  }

  static findByCaseId(caseId) {
    return http.get('/case/'+caseId+'/alerts');
  }

  static findByProcessId(processId) {
    return http.get('/process/'+processId+'/alerts');
  }

  static findById(alertId) {
    return http.get('/alert/'+alertId);
  }

  static deleteById(alertId) {
    return http.del('/alert/'+alertId);
  }

}