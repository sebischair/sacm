import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Case extends Model{

  static create(data){
    return http.post('/cases/', data);
  }

  static findbyId(caseId){
    return http.get('/case/'+caseDefinitionId);
  }

  static deleteById() {
    return http.del('/case/'+caseId);
  }
   
}