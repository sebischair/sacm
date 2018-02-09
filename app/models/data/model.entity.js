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
    console.log('--BEGIN-------------------------');
    try{
      console.log(this.entityWithDeepLinksToString(entity, ''));
    }catch(e){
      console.error(e);
    };
    console.log('--END---------------------------');
  }

  static entityWithDeepLinksToString(entity, prefix){
    let s = '';
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
      }else{
        s += this.lineToString(prefix, isLast, attr.description, attr.values.toString());
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