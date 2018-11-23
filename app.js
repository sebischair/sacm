import express from 'express';
import colors from 'colors';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import apiRoutes from './app/routes/route.app';
import docRoutes from './doc/route';
import http from './app/models/http';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Promise from 'bluebird'; 
import config from './config';
import RestLogger from './app/logging/rest.logger';
import uuid from 'uuid/v1';
import maxmind from 'maxmind';
import winston from 'winston';

const logFormatterConsole = function(options) {
  let log = (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? ''+ JSON.stringify(options.meta) : '');
  //if(options.level == 'error')
  //  log = colors.red(log);
  //if(options.level == 'warn')
  //  log = colors.yellow(log); 
  return log;
};

const logFormatterFile = function(options) {
  let colorCharacters = (colors.green('#')+'#'+colors.red('#')).split('#');
  if(options.message)
    for(let i=0; i<colorCharacters.length; i++){
      options.message = options.message.replace(colorCharacters[i],'');
    }    
  return options.timestamp() +' ['+ options.level.toUpperCase() + '] '+ (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '');
};

const logTimestamp = function() {
  return new Date().toISOString();
};

winston.clear()
winston.add(winston.transports.Console, {json:false, formatter:logFormatterConsole, timestamp:logTimestamp, level: config.winston.console.level});
winston.add(winston.transports.File, { filename: config.winston.file.path, json:false, formatter:logFormatterFile, timestamp:logTimestamp, level: config.winston.file.level});

winston.stream = {
  write: function(message, encoding) {
    if(message.includes('[31m500'))
      winston.error(message.replace('\n',''));
    else  
      winston.debug(message.replace('\n',''));
  },
};

const secret = fs.readFileSync('public.key.pem')+'';

if(config.logging.isEnabled){
  global.cityLookup = maxmind.openSync( __dirname + '/app/logging/db', {cache: {max: 500}});
  RestLogger.establishDBConnection();
}

var app = express();

app.use(compression());

// Enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, simulateuser, authorization");
  next();
});

app.use(function(req, res, next) {

  /** Inject UUID */
  req.uuid = uuid();
  req.start = new Date().getTime();

  /** Inject logging responses after send */
  const send = res.send;
  res.send = function(body){
    const duration = new Date().getTime()-req.start;    
    RestLogger.setStatus(req.uuid, this.statusCode, duration, body);
    send.call(this, body);
  };

  /** Encode XML bodies */
  if(req.is('application/json')){
    next();
  }else{
    let data = new Buffer('');
    req.on('data', function(chunk) {    
      data = Buffer.concat([data, chunk]);
    });
    req.on('end', function() {
      req.rawBody = data;
      //winston.debug(data.toString('utf-8'))
      next();
    });
  }
});

app.use(logger('dev', { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb'}));
app.use(cookieParser());



app.use('/api/v1', (req, res, next)=>{

  /** Use different user for test execution as for import */
  if(req.headers.executionuser != null){
    req.executionJwt = http.generateJWT(req.headers.executionuser, config.sociocortex.defaultPassword);
    winston.debug(req.executionJwt);    
  }

  /** Testing Simulate User Authorization */
  if(req.headers.simulateuser != null && req.headers.authorization == null){
    let pw;
    let user;
    if(req.headers.simulateuser.indexOf(':') !== -1){
      const arr = req.headers.simulateuser.split(':');
      user = arr[0];
      pw = arr[1];
    } else{
      user = req.headers.simulateuser;
      pw = config.sociocortex.defaultPassword;
    }
    req.jwt = http.generateJWT(user, pw);
    winston.debug('simulate user '+user);
    winston.debug(req.jwt);    
    RestLogger.simulateUserLog(req, req.headers.simulateuser);
    next();
  } else {

    /** Production JWT Authorization */
    //Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MDA0OTgwNzEsInVzZXJfbmFtZSI6IntcInV1aWRcIjpcIjJjOTQ4MDg0NWJlZTAzZTcwMTViZmNhZDI4OTkwMDEwXCIsXCJ0ZW5hbnRVdWlkXCI6XCIyYzk0ODA4NDViZWUwM2U3MDE1YmZjMDNkYTYxMDAwMVwiLFwiYXBwbGljYXRpb25VdWlkXCI6XCIyYzk0ODA4NDViZWUwM2U3MDE1YmZjMDI2NmQwMDAwMFwifSIsImF1dGhvcml0aWVzIjpbInVzZXIiXSwianRpIjoiNzk2NGFiNTEtYzdhNy00ZWUxLWJiNDgtOTljMThhMTlmNTdhIiwiY2xpZW50X2lkIjoiMmM5NDgwODQ1YmVlMDNlNzAxNWJmYzAyNjZkMDAwMDAiLCJzY29wZSI6WyJwcm9kdWN0aW9uIl19.FhtBWpNCbSyA8980CRof255Ea0Pwyd-AIGe5mBrj3XPHuC_LxEH-_JNcQYl0oanYpR6bbvxXrgCRWK-15kptHd5jPZYwNskADJYE95HHJETnymOuxw8V3e4obBYOwnfhQpQv5JNlXwB2j-EvpwQdf6ECRiwg1bLOBMcjUTDArQ0AunTjVpktN8idh6sKaf7Em1MRXFphYjuLuRkm84iIRG6vFS_gS2lVWpp7xwueY1-bPjdCDLT-jxJe8bqIK0TMRGaYv4rOjG5vgHtSTvvrzsTPoJsWSSdf7F45ncaNtkJY1yNR93wwXS75DRcM2twdsWj8n-Jn1st_mih2zsWi8Q
    if(req.headers.authorization == null){
      res.status(403).send('Authorization header missing!');
    }else{
      const authorization = req.headers.authorization;
      if(!authorization.startsWith('Bearer ')){
        res.status(403).send('Authorization header must start with "Bearer"!');
      }else{
        const token = authorization.replace('Bearer ','');
        jwt.verify(token, secret, {algorithms: ['RS256']}, (err, decoded)=> {
          if(err){
            winston.error('err: '+err);
            res.status(403).send(err);
          }else{
            req.jwt = 'conecarebearer '+token;  
            let un = JSON.parse(decoded.user_name);         
            RestLogger.jwtUserLog(req, un.uuid, un.username, un.tenantUuid);
            next();
          }
        });
      }
    }
  }  
});
app.use('/api/v1', apiRoutes());

app.use('/doc/assets', express.static(__dirname + '/doc/assets'));
app.use('/doc', docRoutes());

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
