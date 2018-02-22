import Promise from 'bluebird';
import http from './http';


export default class Model{

  static addCheckTypeConstraint(data){
    if(data)
      data.checkTypeConstraint=true;
    return data;
  }

  static cleanObject(json){
    let deleteAttrs = ['stateTransitions', 'client', 'owner', 'ownerConstraint', 'externalId', 'mayEdit', 'processDefinition', 'parentStage', 'case', 'nrAlerts', 'nrLogs', 'prev', 'next', 'dueDate'];
    for(let i=0; i<deleteAttrs.length; i++)
      delete json[deleteAttrs[i]];
    let keys = Object.keys(json);
    keys.forEach(key=>{
      if(json[key] instanceof  Array)
        json[key] = this.cleanArray(json[key]);
    });
    return json;
  }

  static cleanArray(jsonArray){
    for(let i=0; i<jsonArray.length; i++){
      if(jsonArray[i] instanceof Array){
        jsonArray[i] = this.cleanArray(jsonArray[i]);
      }else{
        jsonArray[i] = this.cleanObject(jsonArray[i]);
      }
    } 
    return jsonArray;
  }

}