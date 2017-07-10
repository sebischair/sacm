import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Tenant extends Model{


  static findAll(jwt) {
    return http.get(jwt, '/tenants');
  }

  static findUsersById(jwt, tenantId) {
    return http.get(jwt, '/tenants/'+tenantId+'/users');
  }

  static findGroupsById(jwt, tenantId) {
    return http.get(jwt, '/tenants/'+tenantId+'/groups');
  }




}
