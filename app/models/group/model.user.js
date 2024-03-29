import Promise from 'bluebird';
import winston from 'winston';
import http from '../http';
import Model from '../model';
import config from '../../../config';


export default class User extends Model{

  static create(jwt, data) {
    return http.post(jwt, '/users', this.addCheckTypeConstraint(data));
  }

  static verify(jwt, userId, email, magic){
    return http.post(jwt, '/users/'+userId+'/verify', {email: email, magic: magic});
  }

  static disable(jwt, userId){
    return http.post(jwt, '/users/'+userId+'/disable');
  }

  static enable(jwt, userId){
    return http.post(jwt, '/users/'+userId+'/enable');
  }

  static createAndVerify(jwt, data) {
    let u = null;
    data.password = config.sociocortex.defaultPassword;
    data.passwordAgain = config.sociocortex.defaultPassword;
    return User.create(jwt, data)
      .then(user=>{
        u = user;
        return User.verify(jwt, user.id, user.email, user.magic);
      })
      .then(verify=>{
        return Promise.resolve(u);
      });
  }

  static findAll(jwt) {
    return http.get(jwt, '/users');
  }

  static findById(jwt, userId) {
    return http.get(jwt, '/users/'+userId);
  }

  static updateById(jwt, data) {
    return http.put(jwt, '/users/'+data.id, this.addCheckTypeConstraint(data));
  }

  static deleteById(jwt, userId) {
    return http.del(jwt, '/users/'+userId);
  }

  static deleteAll(jwt) {
    return User.findAll(jwt)
      .then(users=>{
        users = users.filter(user=>user.name != 'Max Mustermann');
        return Promise.each(users, user=>{
          return User.deleteById(jwt, user.id);
        })
        .catch(err=>{
          winston.error(err);
        })
      });
  }

  static me(jwt) {
    return http.get(jwt, '/users/me');
  }


}
