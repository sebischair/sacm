import Promise from 'bluebird';
import http from './http';


export default class Model{

  static addCheckTypeConstraint(data){
    if(data)
      data.checkTypeConstraint=true;
    return data;
  }

  static cleanObject(json, deleteAttrs = ['stateTransitions', 'client', 'owner', 'ownerConstraint', 'externalId', 'mayEdit', 'processDefinition', 'parentStage', 'case', 'nrAlerts', 'nrLogs', 'prev', 'next', 'dueDate']){
    for(let i=0; i<deleteAttrs.length; i++)
      delete json[deleteAttrs[i]];
    let keys = Object.keys(json);
    keys.forEach(key=>{
      if(json[key] instanceof  Array)
        json[key] = this.cleanArray(json[key], deleteAttrs);
    });
    return json;
  }

  static cleanArray(jsonArray, deleteAttrs){
    for(let i=0; i<jsonArray.length; i++){
      if(jsonArray[i] instanceof Array){
        jsonArray[i] = this.cleanArray(jsonArray[i], deleteAttrs);
      }else{
        jsonArray[i] = this.cleanObject(jsonArray[i], deleteAttrs);
      }
    } 
    return jsonArray;
  }

  /** 
   * This error should be used for all errors that can not be handled natively in SocioCortex 
   * e.g. ensure that EntityDefinition description is set can not be checked 
   * in SocioCortex due to legacy constraints
  */
  static error(error, description) {
    return Promise.reject({
      error: error,
      description: description
    })
  }

}