import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class AutomatedTaskDefinition extends Model{

  static create(data) {
    return http.post('/automatedtaskdefinitions/', data);
  }

  static findById(automatedTaskDefinitionId) {
    return http.get('/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }

  static deleteById(automatedTaskDefinitionId) {
    return http.del('/automatedtaskdefinition/'+automatedTaskDefinitionId);
  }
  
}