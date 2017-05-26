import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SumamrySection extends Model{


  static findByCaseId(caseId) {
    return http.get('/case/'+caseId+'/summarysections');
  }

}