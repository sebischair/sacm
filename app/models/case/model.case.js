import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Case extends Model{

  static create(data){
    return http.post('/cases/', data);
  }

  static findbyWorkspaceId(workspaceId){
    return http.get('/workspace/'+workspaceId+'/cases');
  }
  static findbyId(caseId){
    return http.get('/case/'+caseId);
  }

  static findTreebyId(caseId){
    return http.get('/case/'+caseId+'/tree');
  }

  static deleteById() {
    return http.del('/case/'+caseId);
  }
   
}