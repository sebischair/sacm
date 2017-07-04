import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Message extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/messages', data);
  }

  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/cases/'+caseId+'/messages');
  }

  static findById(jwt, messageId) {
    return http.get(jwt, '/messages/'+messageId);
  }

}