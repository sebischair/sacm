import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class SumamrySection extends Model{


  static findByCaseId(jwt, caseId) {
    return http.get(jwt, '/case/'+caseId+'/summarysections');
  }

}