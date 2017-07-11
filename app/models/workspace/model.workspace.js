import Promise from 'bluebird';
import http from './../http';
import Model from './../model';


export default class Workspace extends Model{

  static create(jwt, data){
    return http.post(jwt, '/workspaces', data);
  }

  static deleteById(jwt, workspaceId, ifexist){
    let p = http.del(jwt, '/workspaces/' + workspaceId, {});
    if(ifexist){
        return new Promise(function (resolve, reject) {
            p.then(()=>{ resolve(); });
            p.catch(()=>{ resolve(); });
        });
    }else{
       return p;
    }
  }

  static deleteAll(jwt){
    return Workspace.findAll(jwt)

      .then(workspaces=>{
        return Promise.map(workspaces, w=>{
          if(w.id != "root" && w.id != "northwind")
            return Workspace.deleteById(jwt, w.id);
        });
      });

  } 

  static findAll(jwt){
    return http.get(jwt, '/workspaces');
  }

  static findById(jwt, workspaceId){
    return http.get(jwt, '/workspaces/'+workspaceId);
  }

}