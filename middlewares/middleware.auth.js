// Modules
import passport from 'passport';
import BasicStrategy from 'passport-http';

module.exports =
function Auth(param) {

  // Define strategy
  passport.use(new BasicStrategy(
    function(userid, password, done) {

      if(password === '123') {
        return done(null, {id: 2, name: 'hans'});
      }
      return done(null, false);

    }
  ));


  return function (req, res, next) {
    passport.authenticate('basic', { session: false });
    return next();
  };

}
