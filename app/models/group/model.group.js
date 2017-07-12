import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Group extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/groups', data);
  }

  static findAll(jwt) {
    return http.get(jwt, '/groups');
  }

  static findById(jwt, groupId) {
    return http.get(jwt, '/groups/'+groupId, {meta: "description, members", membermeta: "groups", memberattributes: "firstname, lastname"});
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/groups/'+data.id, data);
  }

  static deleteById(jwt, groupId) {
    return http.del(jwt, '/groups/'+groupId);
  }

  static addMember(jwt, groupId, principalId) {
    return http.post(jwt, '/groups/'+groupId+'/member/'+principalId);
  }

  static delMember(jwt, groupId, principalId) {
    return http.del(jwt, '/groups/'+groupId+'/member/'+principalId);
  }

  static deleteAll(jwt) {
    return Group.findAll(jwt)
      .then(groups=>{
        groups = groups.filter(group=>group.id != 'administrators');
        return Promise.each(groups, group=>{
          return Group.deleteById(jwt, group.id);
        })
        .catch(err=>{
          console.log(err);
        })
      });
  }

}
