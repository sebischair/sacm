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

  static seenByCaseId(jwt, caseId) {
    return http.post(jwt, '/cases/'+caseId+'/alerts/seen');
  }

  static seenByWorkspaceId(jwt, workspaceId) {
    return http.post(jwt, '/workspaces/'+workspaceId+'/alerts/me/seen');
  }

  static seenByMe(jwt) {
    return http.post(jwt, '/alerts/me/seen');
  }

  static findMeUnseen(jwt) {
    return http.get(jwt, '/alerts/me/unseen');
  }

  static findMeUnseenByWorkspace(jwt, workspaceId) {
    return http.get(jwt, '/workspaces/'+workspaceId+'/alerts/me/unseen');
  }
}