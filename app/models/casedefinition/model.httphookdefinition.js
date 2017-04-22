import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HttpHookDefinition extends Model{

  static create(data) {
    return http.post('/httphookdefinitions/', data);
  }

  static findById(httpHookDefinitionId) {
    return http.get('/httphookdefinition/'+httpHookDefinitionId);
  }

  static findByProcessDefinitionId(processDefinitionId) {
    return http.get('/processdefinition/'+processDefinitionId+'/httphookdefinitions');
  }

  static deleteById(httpHookDefinitionId) {
    return http.del('/httphookdefinition/'+httpHookDefinitionId);
  }
  
}