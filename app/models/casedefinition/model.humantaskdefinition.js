import mongoose from 'mongoose';
import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class HumanTaskDefinition extends Model{

  static create(data) {
    return http.post('/humantaskdefinitions/', data);
  }

  static findById(humanTaskDefinitionId) {
    return http.get('/humantaskdefinition/'+humanTaskDefinitionId);
  }

  static deleteById(humanTaskDefinitionId) {
    return http.del('/humantaskdefinition/'+humanTaskDefinitionId);
  }
  
}