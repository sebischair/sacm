import Promise from 'bluebird';
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

  static findDeepLinksById(jwt, entityId){
    return http.get(jwt, '/caseentities/'+entityId+'/deeplinks')
    .then(entity=>{
      this.printEntityWithDeepLinks(entity);      
      return Promise.resolve(entity);
    });
  }

  static printEntityWithDeepLinks(entity){
    console.log(entity);
    console.log('--BEGIN-------------------------');
    console.log(this.entityWithDeepLinksToString(entity, 0));
    console.log('--END---------------------------');
  }

  static entityWithDeepLinksToString(entity, level){
    let s = '';
    entity.attributes.forEach(attr => {
      if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'entities'){
        s += this.lineToString(level, '+', attr.description, '');
        if(attr.values[0] != null)
          s += this.entityWithDeepLinksToString(attr.values[0], level+1);
      }else if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'users'){
        s += this.lineToString(level, '+', attr.description, attr.values[0].name);
      }else if(attr.attributeType == 'json'){
        s += this.lineToString(level, '-', attr.description, attr.values.toString());
      }else{
        s += this.lineToString(level, '-', attr.description, attr.values.toString());
      }
    });
    return s;
  }

  static lineToString(level, icon, name, value){
    let spaces = '';
    for(let i=0; i<level; i++)
      spaces += '  ';
    return spaces+colors.gray(icon + name +': ')+colors.green(value)+' \n'
  }
  

}