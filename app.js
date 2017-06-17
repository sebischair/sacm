import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './app/routes/route.app';
import docRoutes from './doc/route';

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api', (req, res, next)=>{

  req.jwt = req.headers.authorization;  
  /** this simulates the user Max Mustermann */
  if(req.jwt == null)
    req.jwt = 'Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv';
  if(req.jwt != null){
    next();
  }else{
    res.status(403).send();
  }
});
app.use('/api', routes())

app.use('/doc/assets', express.static(__dirname + '/doc/assets'));
app.use('/', docRoutes())

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
