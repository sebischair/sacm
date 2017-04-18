import mongoose from 'mongoose';
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

  static deleteById(httpHookDefinitionId) {
    return http.del('/httphookdefinition/'+httpHookDefinitionId);
  }
  
}