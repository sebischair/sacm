import Promise from 'bluebird';
import winston from 'winston';
import http from '../http';
import Model from '../model';
import colors from 'colors';


export default class Entity extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/entities', data);
  }

  static findById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId);
  }

  static findNavigationTreeById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId+'/navigationtree');
  }

  static findDeepLinksById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId+'/deeplinks')
    .then(entity=>{
      this.printEntityWithDeepLinks(entity);      
      return Promise.resolve(entity);
    });
  }

  static printEntityWithDeepLinks(entity){
    try{
      winston.debug('\n'+this.entityWithDeepLinksToString(entity, ''));
    }catch(e){
      winston.error(e);
    };
  }

  static entityWithDeepLinksToString(entity, prefix){
    let s = '';
    if(prefix == '')
      s += colors.bgWhite.gray('CaseEntity '+entity.id)+'\n';
    entity.attributes.forEach((attr, i) => {
      const isLast = entity.attributes.length-1 == i
      if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'entities'){
        s += this.lineToString(prefix, isLast, attr.description, '');
        if(attr.values != null)
          attr.values.forEach((value, i)=>{
            const icon = isLast ? '  ' : '│ ';
            s += this.entityWithDeepLinksToString(value, prefix+icon);
          });          
      }else if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'users'){
        s += this.lineToString(prefix, isLast, attr.description, attr.values[0].name);
      }else if(attr.attributeType == 'json'){
        let value = ''
        if(attr.values != null);
          value = JSON.stringify(attr.values);
        s += this.lineToString(prefix, isLast, attr.description, value);
      }else if(attr.attributeType == 'enumeration'){
        let description = '';
        if(attr.values != null){
          const map = new Map();
          attr.attributeTypeConstraints.enumerationOptions.forEach(option=>{
            map.set(option.value, option.description);
          });
          attr.values.forEach((value, i)=>{
            let sep = attr.values.length-1 == i ? '' : ' | ';
            description += map.get(value)+ sep;
          });
        }
        s += this.lineToString(prefix, isLast, attr.description, description);
      }else{
        let description = '';
        if(attr.values != null)
          attr.values.forEach((value, i)=>{
            let sep = attr.values.length-1 == i ? '' : ' | ';
            description += value+ sep;
          });
        s += this.lineToString(prefix, isLast, attr.description, description);
      }
    });
    return s;
  }

  static lineToString(prefix, isLast, name, value){
    return colors.gray(prefix + this.simpleSymbol(isLast) + name +': ')+colors.green(value)+' \n'
  }

  static simpleSymbol(isLast){
    if(isLast)
      return '└─';
    else
      return '├─';
  }

  

}