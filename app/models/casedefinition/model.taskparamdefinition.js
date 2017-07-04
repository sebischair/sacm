import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class TaskParamDefinition extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/taskparamdefinitions/', data);
  }

  static findById(jwt, taskParamDefinitionId) {
    return http.get(jwt, '/taskparamdefinitions/'+taskParamDefinitionId);
  }

  static findByTaskDefinitionId(jwt, taskDefinitionId) {
    return http.get(jwt, '/taskdefinitions/'+taskDefinitionId+'/taskparamdefinitions');
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/taskparamdefinitions/'+data.id, data);
  }

  static deleteById(jwt, taskParamDefinitionId) {
    return http.del(jwt, '/taskparamdefinitions/'+taskParamDefinitionId);
  }

}
