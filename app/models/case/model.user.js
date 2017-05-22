import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class User extends Model{

  static create(data) {
    return http.post('/users', data)
  }

  static verify(userId, email, magic){
    return http.post('/users/'+userId+'/verify', {email: email, magic: magic});
  }

  static createAndVerify(data) {
    let u = null;
    return User.create(data)
      .then(user=>{
        u = user;
        return User.verify(user.id, user.email, user.magic);
      })
      .then(verify=>{
        return Promise.resolve(u);
      });
  }

  static findAll() {
    return http.get('/users');
  }

  static findById(userId) {
    return http.get('/users/'+userId);
  }

  static updateById(data) {
    return http.put('/users/'+data.id, data);
  }

  static deleteById(userId) {
    return http.del('/users/'+userId);
  }

  static deleteAll() {
    return User.findAll()
      .then(users=>{
        users = users.filter(user=>user.name != 'Max Mustermann');
        return Promise.each(users, user=>{
          return User.deleteById(user.id);
        })
        .catch(err=>{
          console.log(err);
        })
      });
  }

  static me() {
    return http.get('/users/me');
  }


}
