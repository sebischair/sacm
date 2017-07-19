import express from 'express';
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

const secret = fs.readFileSync('public.key.pem')+'';

var app = express();

app.use(compression());

// Enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, simulateuser, authorization");
  next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api', (req, res, next)=>{

  /** Testing Simulate User Authorization */
  if(req.headers.simulateuser != null){
    req.jwt = http.generateJWT(req.headers.simulateuser, 'ottto');
    console.log('simulate user '+req.headers.simulateuser);
    console.log(req.jwt);
    next();
  }else{
    
    /** Production JWT Authorization */
    //Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MDA0OTgwNzEsInVzZXJfbmFtZSI6IntcInV1aWRcIjpcIjJjOTQ4MDg0NWJlZTAzZTcwMTViZmNhZDI4OTkwMDEwXCIsXCJ0ZW5hbnRVdWlkXCI6XCIyYzk0ODA4NDViZWUwM2U3MDE1YmZjMDNkYTYxMDAwMVwiLFwiYXBwbGljYXRpb25VdWlkXCI6XCIyYzk0ODA4NDViZWUwM2U3MDE1YmZjMDI2NmQwMDAwMFwifSIsImF1dGhvcml0aWVzIjpbInVzZXIiXSwianRpIjoiNzk2NGFiNTEtYzdhNy00ZWUxLWJiNDgtOTljMThhMTlmNTdhIiwiY2xpZW50X2lkIjoiMmM5NDgwODQ1YmVlMDNlNzAxNWJmYzAyNjZkMDAwMDAiLCJzY29wZSI6WyJwcm9kdWN0aW9uIl19.FhtBWpNCbSyA8980CRof255Ea0Pwyd-AIGe5mBrj3XPHuC_LxEH-_JNcQYl0oanYpR6bbvxXrgCRWK-15kptHd5jPZYwNskADJYE95HHJETnymOuxw8V3e4obBYOwnfhQpQv5JNlXwB2j-EvpwQdf6ECRiwg1bLOBMcjUTDArQ0AunTjVpktN8idh6sKaf7Em1MRXFphYjuLuRkm84iIRG6vFS_gS2lVWpp7xwueY1-bPjdCDLT-jxJe8bqIK0TMRGaYv4rOjG5vgHtSTvvrzsTPoJsWSSdf7F45ncaNtkJY1yNR93wwXS75DRcM2twdsWj8n-Jn1st_mih2zsWi8Q
    if(req.headers.authorization == null){
      res.status(403).send('Authorization header missing!');
    }else{
      const authorization = req.headers.authorization;
      if(!authorization.startsWith('Bearer ')){
        res.status(403).send('Authorization header musst start with "Bearer"!');
      }else{
        const token = authorization.replace('Bearer ');
        jwt.verify(token, secret, {algorithms: ['RS256']}, (err, decoded)=> {
          if(err){
            console.log('err: '+err);
            res.status(403).send(err);
          }else{
            console.log('decoded token')
            console.log(decoded) 
            req.jwt = token;
            next();
          }
        });
      }
    }

  }  
});
app.use('/api/v1', apiRoutes())

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
