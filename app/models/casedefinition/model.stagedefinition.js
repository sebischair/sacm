import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class StageDefinition extends Model{

  static create(data) {
    return http.post('/stagedefinitions/', data);
  }

  static findAll() {
    return http.get('/stagedefinitions/');
  }

  static findById(stageDefinitionId) {
    return http.get('/stagedefinition/'+stageDefinitionId);
  }

  static deleteById(stageDefinitionId) {
    return http.del('/stagedefinition/'+stageDefinitionId);
  }
  
}