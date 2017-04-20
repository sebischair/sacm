import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Message extends Model{

  static create(data) {
    return http.post('case/'+data.case+'/messages', data);
  }

  static findByCaseId(caseId) {
    return http.get('case/'+caseId+'/messages');
  }

  static findById(messageId) {
    return http.get('message/'+messageId);
  }

  static deleteById(messageId) {
    return http.del('message/'+messageId);
  }

}