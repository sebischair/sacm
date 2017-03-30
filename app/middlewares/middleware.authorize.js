import {sacm_acl} from './../acl/acl.app';


class Authorizer {

  constructor() {}


  authorizeResource(resource) {
    return sacm_acl.getACL().middleware(2, function(req, res, next) {return req.user.id}, resource);
  }

  // TODO:: Add any custom authorization method
  authorizeInstance() {
    return function(req, res, next) {
      sacm_acl.getACL().hasRole( req.user.id, 'doctor', (err, hasRole) => {
        if(hasRole) {
          return next();
        } else {
          return res.send(401);
        }
      });
    }
    // eof
  }

 // eoc
}


export default Authorizer;
