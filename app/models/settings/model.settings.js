import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class Settings extends Model{


  static find(jwt) {
    return http.get(jwt, '/settings');
  }

  static update(jwt, data) {
    return http.put(jwt, '/settings', data);
  }

}
