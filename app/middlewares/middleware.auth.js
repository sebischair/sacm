import passport from 'passport';
import Strategy from 'passport-local';
import CustomStrategy from 'passport-custom';

passport.use('ll', new Strategy(
  function(username, password, done) {
    // database dummy - find user and verify password
    if(username === 'devils name' && password === '666'){
      done(null, {
        id: 666,
        firstname: 'devils',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true
      });
    }
    else {
      done(null, false);
    }
  }
));

passport.use('useOAuth2', new CustomStrategy(
  function(req, done) {
    var username = req.body.username;
    var password = req.body.password;
    // database dummy - find user and verify password
    if(username === 'devils name' && password === '666'){
      done(null, {
        id: 666,
        firstname: 'devils',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true
      });
    }
    else {
      done(null, false);
    }
  }
));


module.exports = passport;
