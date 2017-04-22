import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class TaskParamDefinition extends Model{

  static create(data) {
    return http.post('/taskparamdefinitions/', data);
  }

  static findById(taskParamDefinitionId) {
    return http.get('/taskparamdefinition/'+taskParamDefinitionId);
  }

  static findByTaskDefinitionId(taskDefinitionId) {
    return http.get('/taskdefinition/'+taskDefinitionId+'/taskparamdefinitions');
  }

  static updateById(taskParamDefinitionId, data) {
    return http.put('/taskparamdefinition/'+taskParamDefinitionId, data);
  }

  static deleteById(taskParamDefinitionId) {
    return http.del('/taskparamdefinition/'+taskParamDefinitionId);
  }
  
}