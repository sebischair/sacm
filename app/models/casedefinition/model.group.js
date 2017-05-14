import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Group extends Model{

  static create(data) {
    return http.post('/groups', data);
  }

  static find() {
    return http.get('/groups');
  }

  static deleteById(groupId) {
    return http.del('/groups/'+groupId);
  }

  static deleteAll() {
    return Group.find()
      .then(groups=>{
        groups = groups.filter(group=>group.id != 'administrators');
        return Promise.each(groups, group=>{
          return Group.deleteById(group.id);
        })
        .catch(err=>{
          console.log(err);
        })
      });    
  }

}