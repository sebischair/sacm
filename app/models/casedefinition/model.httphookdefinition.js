import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HttpHookDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/httphookdefinitions/', data);
  }

  static findById(jwt, httpHookDefinitionId) {
    return http.get(jwt, '/httphookdefinitions/'+httpHookDefinitionId);
  }

  static findByProcessDefinitionId(jwt, processDefinitionId) {
    return http.get(jwt, '/processdefinitions/'+processDefinitionId+'/httphookdefinitions');
  }

  static updateById(jwt, httpHookDefinitionId, data) {
    return http.put(jwt, '/httphookdefinitions/'+httpHookDefinitionId, data);
  }

  static deleteById(jwt, httpHookDefinitionId) {
    return http.del(jwt, '/httphookdefinitions/'+httpHookDefinitionId);
  }
  
}