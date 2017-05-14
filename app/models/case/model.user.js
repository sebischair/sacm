import Promise from 'bluebird';
import http from '../http';
import Model from '../model';


export default class User extends Model{

  static create(data) {
    return http.post('/users', data);
  }

  static find() {
    return http.get('/users');
  }

  static deleteById(userId) {
    return http.del('/users/'+userId);
  }

  static deleteAll() {    
    return User.find()
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


}