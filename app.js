import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './app/routes/route.app'
import Promise from 'bluebird';



//import mongoose from 'mongoose';
//mongoose.Promise = Promise;

var app = express();
/*
//var sequelize = new Sequelize(config.db.name, config.db.user, config.db.pw, config.db.options);
try {
   mongoose.connect('mongodb://localhost:27017/sacm');
} catch(e) {

}
mongoose.Promise = Promise;*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/doc', express.static(__dirname + '/app/doc'));
app.use('/api', routes())


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
