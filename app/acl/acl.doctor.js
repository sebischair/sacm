/*
class Doctor {

  constructor(acl) {
    this.acl = acl;
  }

  init() {
    this.acl.allow([
        {
            roles:['doctor'],
            allows:[
                {resources:'/api/casedefinition', permissions:'create'}
            ]
        }
    ])
  }


  addRole(userId, role, cb) {
    this.acl.addUserRoles(userId, role, cb);
  }

}

export default Doctor
*/
