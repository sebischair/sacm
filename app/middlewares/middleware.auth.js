// Modules
import passport from 'passport';
import BasicStrategy from 'passport-http';

module.exports =
function Auth(param) {


  return function (req, res, next) {
    return next();
  };

}
