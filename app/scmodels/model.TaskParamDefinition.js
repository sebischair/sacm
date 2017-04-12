import mongoose from 'mongoose';
import Promise from 'bluebird';
import http from './http';
import Model from './model';


export default class TaskParamDefinition extends Model{

  static create(data) {
    return http.post('/taskparamdefinitions/', data);
  }

  static findById(taskParamDefinitionId) {
    return http.get('/taskparamdefinition/'+taskParamDefinitionId);
  }

  static deleteById(taskParamDefinitionId) {
    return http.del('/taskparamdefinition/'+taskParamDefinitionId);
  }
  
}