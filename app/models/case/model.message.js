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

  static seen(jwt, messageId) {
    return http.post(jwt, '/messages/'+messageId+'/seen');
  }

  static findByMeUnseen(jwt) {
    return http.get(jwt, '/messages/me/unseen');
  }

  static seenCase(jwt, caseId) {
    return http.post(jwt, '/cases/'+caseId+'/messages/seen');
  }

}