import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class TaskParam extends Model{

  static autocompleteById(jwt, taskParamId) {
    return http.get(jwt, '/taskparams/'+taskParamId+'/autocomplete');
  }

}