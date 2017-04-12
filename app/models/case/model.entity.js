import mongoose from 'mongoose';
import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Attribute extends Model{

  static create(data) {
    return http.post('/entities', data);
  }

}