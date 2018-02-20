import Promise from 'bluebird';
import http from './http';


export default class Model{

  static addCheckTypeConstraint(data){
    if(data)
      data.checkTypeConstraint=true;
    return data;
  }

}