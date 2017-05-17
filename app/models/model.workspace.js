import Promise from 'bluebird';
import http from './http';
import Model from './model';


export default class Workspace extends Model{

  static create(data){
    console.log('CREATE WORKSPACE');
    const dataaa = {
        name: 'workspaceName', 
      
        permissions: {
            readers: [{
                name: "Everybody",
                id: "everybody"
            }],
            writers: [{
                name: "All registered users",
                id: "allusers"
            }],
            //contributors: [],
            //administrators: []
        }
        
    };
    return http.post('/workspaces', data);
  }

  static deleteById(workspaceId, ifexist){
    var p = http.del('/workspaces/' + workspaceId, {});
    if(ifexist){
        return new Promise(function (resolve, reject) {
            p.then(()=>{ resolve(); });
            p.catch(()=>{ resolve(); });
        });
    }else{
       return p;
    }
  }

  static deleteAndCreateByName(workspaceName){
    return Workspace.findAll()
      .then(workspaces=>{
        let wId = null;
        workspaces.forEach(w=>{
          if(w.name == workspaceName)
            wId = w.id;
        });
        if(wId == null)
          return Promise.resolve();
        else
          return Workspace.deleteById(wId);
      })
      .then(()=>{
        return Workspace.create(wokspaceName);
      });
  }

  static deleteAll(){
    return Workspace.findAll()
      .then(workspaces=>{
        return Promise.map(workspaces, w=>{
          if(w.id != "root" && w.id != "northwind")
            return Workspace.deleteById(w.id);
        });
      });
  } 

  static findAll(){
    return http.get('/workspaces');
  }

  static findById(wokspaceId){
    return http.get('/workspaces/'+workspaceId);
  }

}