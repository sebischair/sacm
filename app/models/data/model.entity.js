import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


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
    console.log('--------------------------');
    console.log(this.entityWithDeepLinksToString(entity, 0));
  }

  static entityWithDeepLinksToString(entity, level){
    let s = '';
    let spaces = '';
    for(let i=0; i<level; i++){
      spaces += '  ';
    }
    entity.attributes.forEach(attr => {
      if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'entities'){
        s += spaces+'+'+attr.description + ' \n'
        s += this.entityWithDeepLinksToString(attr.values[0], level+1);
      }else if(attr.attributeType == 'link' && attr.attributeTypeConstraints.resourceType == 'users'){
        s += spaces+'+'+attr.description +': '+attr.values[0].name+' \n'
      }else
        s += spaces+'-'+attr.description + ": " +attr.values.toString()+'\n';
    });
    return s;
  }
  

}