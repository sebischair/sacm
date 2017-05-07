import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Sumamry extends Model{


  static findByCaseId(caseId) {
    return http.get('/case/'+caseId+'/summary');
  }

}