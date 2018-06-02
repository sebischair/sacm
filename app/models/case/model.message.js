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

  static seenByCaseId(jwt, caseId) {
    return http.post(jwt, '/cases/'+caseId+'/messages/seen');
  }

  static seenByWorkspaceId(jwt, workspaceId) {
    return http.post(jwt, '/workspaces/'+workspaceId+'/messages/me/seen');
  }

  static seenByMe(jwt) {
    return http.post(jwt, '/messages/me/seen');
  }

  static findMeUnseen(jwt) {
    return http.get(jwt, '/messages/me/unseen');
  }

  static findMeUnseenByWorkspace(jwt, workspaceId) {
    return http.get(jwt, '/workspaces/'+workspaceId+'/messages/me/unseen');
  }



}