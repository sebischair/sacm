import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import apiRoutes from './app/routes/route.app';
import docRoutes from './doc/route';
import http from './app/models/http';

var app = express();

// Enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api', (req, res, next)=>{

  /** this simulates the a custom user */

  if(req.headers.simulateuser != null){
    req.jwt = http.generateJWT(req.headers.simulateuser, 'ottto');
    console.log('simulate user '+req.headers.simulateuser);
    console.log(req.jwt);
  }

  /** this simulates the user Max Mustermann */
  if(req.jwt == null){
    req.jwt = 'Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv';
    console.log('simulate user max mustermann');
  }
  if(req.jwt != null){
    next();
  }else{
    res.status(403).send();
  }
});
app.use('/api', apiRoutes())

app.use('/doc/assets', express.static(__dirname + '/doc/assets'));
app.use('/doc', docRoutes())

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(500).send(err);
});

module.exports = app;
