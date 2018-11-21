import mongoose from 'mongoose';
import Promise from 'bluebird';
import listEndpoints from 'express-list-endpoints';
import maxmind from 'maxmind';
import winston from 'winston';
import config from './../../config';
import apiRoutes from '../routes/route.app';
import sizeof from 'object-sizeof';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const methods = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS'
};
const routes = new Set(listEndpoints(apiRoutes()).map(endpoint => endpoint.path.split('/')));

function allMethods(){
  const arr = [];
  Object.keys(methods).forEach(k => {
    arr.push(methods[k]);
  });
  return arr;
}

const applications = {
  SACMFRONTEND: 'SACM.FRONTEND',
  UIM: 'UIM',
  SMS: 'SMS',
  POSTMAN: 'POSTMAN',
  NA: 'NA'
};

function allApplications(){
  const arr = [];
  Object.keys(applications).forEach(k => {
    arr.push(applications[k]);
  });
  return arr;
}

function extractUrlPattern(url){
  let urlPattern = "";
  if (url == null)
    return urlPattern;
  while (url.lastIndexOf('/') === url.length - 1)   // remove trailing slashes
    url = url.substring(0, url.length - 1);
  let splitUrl = url.split('/');
  routes.forEach(splitRoute => {
      if (splitRoute.length === splitUrl.length) {
        let differencesDetected = splitRoute.some((routeSubPath, index) => routeSubPath.indexOf(':') !== 0 && routeSubPath !== splitUrl[index]);
        if (!differencesDetected)
          urlPattern = splitRoute.join('/');
      }
  });
  return urlPattern;
}

const resources = new Set(['import', 'workspaces', 'groups', 'users', 'entities', 'alerts', 'automatedtasks', 'cases', 'humantasks', 'dualtasks', 'logs', 'messages', 'processes', 'stages', 'summarysections', 'tasks', 'taskparams']);
function extractResource(urlPattern){
  if(urlPattern == null)
    return;
  const urlSections = urlPattern.split('/');
  for(let i=urlSections.length-1; i>0; i--){
    if(resources.has(urlSections[i]))
      return urlSections[i];
  }
  return null;
}

function ip2Location(ip){
  let l = cityLookup.get(ip);
  let r = {
    countryCode: null,
    country: null,
    city: null,
    zip: null,
    latitude: null,
    longitude: null,
    accuracy: null
  };
  if(l && l.city && l.city.names)
    r.city = l.city.names.en;
  if(l && l.country && l.country.names)
    r.country = l.country.names.en;
  if(l && l.location && l.location){
    r.latitude = l.location.latitude;
    r.longitude = l.location.longitude;
    r.accuracy = l.location.accuracy_radius;
  }
  if(l && l.postal)
    r.zip = l.postal.code;
  if(l && l.country)
    r.countryCode = l.country.iso_code;
  //winston.debug(ip+" "+r.country+" ("+r.countryCode+") "+r.zip+" "+r.city+" "+r.latitude+" "+r.longitude+" "+r.accuracy)
  return r;
}

const LogSchema = new mongoose.Schema({
  application: {type: String, enum: allApplications(), index: true},
  ip: {type: String, index: true},
  userAgent: {type: String, index: true},
  isMobile: {type: Boolean, index: true},
  method: {type: String, enum: allMethods(), index: true},
  url: {type: String, index: true},
  urlPattern: {type: String, index: true},
  resource: {type: String, index: true},
  body: {type: String, index: true},
  isGzip: {type: String, index: true},
  acceptLanguage: {type: String, index: true},
  isSimulateUser: {type: Boolean, index: true},
  userId: {type: String, index: true},
  email: {type: String, index: true},
  workspaceId: {type: String, index: true},
  status: {type: Number, index: true},
  uuid: {type: String, index: true},
  duration: {type: Number, index: true},
  reqBody: Mixed,
  reqBodySize: Number,
  resBody: Mixed,
  resBodySize: Number,
  location: {
    countryCode: {type: String, index: true},
    country: {type: String, index: true},
    city: {type: String, index: true},
    zip: {type: String, index: true},
    latitude: {type: Number, index: true},
    longitude: {type: Number, index: true},
    accuracy: {type: Number, index: true}
  }
},{timestamps: true});

LogSchema.statics.jwtUserLog = (req, userId, userName, workspaceId)=>{
  Log.log(req, false, userId, userName, null, workspaceId);
};

LogSchema.statics.simulateUserLog = (req, email)=>{
  Log.log(req, true, null, null, email, null);
};

LogSchema.statics.log = (req, isSimulateUser, userId, userName, email, workspaceId)=>{
  if(!config.logging.isEnabled)
    return;
  let application = applications.NA;
  if(req.headers['postman-token'] != null)
    application = applications.POSTMAN;
  if(req.headers['application'] == applications.SACMFRONTEND.toLowerCase())
    application = applications.SACMFRONTEND;
  if(req.headers['application'] == applications.UIM.toLowerCase())
    application = applications.UIM;
  if(req.headers['application'] == applications.SMS.toLowerCase())
    application = applications.SMS;

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  let isGzip = false;
  if(req.headers['accept-encoding'] != null && req.headers['accept-encoding'].indexOf('gzip') !== -1)
  isGzip = true;

  let userAgent = req.headers['user-agent'];
  let isMobile = false;
  if (userAgent != null && /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(userAgent))
    isMobile = true;

  let reqBodySize = 0;
  if(req.body)
    reqBodySize = sizeof(req.body);

  Log.create({
    application: application,
    ip: ip,
    userAgent: userAgent,
    isMobile: isMobile,
    method: req.method,
    url: req.url,
    urlPattern: extractUrlPattern(req.url),
    resource: extractResource(req.url),
    isGzip: isGzip,
    acceptLanguage: req.headers['accept-language'],
    isSimulateUser: isSimulateUser,
    userId: userId,
    username: userName,
    email: email,
    workspaceId: workspaceId,
    reqBody: req.body,
    reqBodySize: reqBodySize,
    uuid: req.uuid,
    location: ip2Location(ip)
  });
};

LogSchema.statics.setStatus = (uuid, status, duration, resBody)=>{

  let resBodyLog = null;
  if(status != 200)
    resBodyLog = resBody;

  let resBodySize = 0;
  if(resBody)
    resBodySize = sizeof(resBody);

  const data = {status:status, duration:duration, resBody:resBodyLog, resBodySize:resBodySize};
  Log.update({uuid:uuid, status:null}, {$set: data}, function (err){
    if (err)
      winston.error(err);
  });
};



let Log = mongoose.model('Log', LogSchema);
export default Log;


/** Mongo DB query for analytics
db.getCollection('logs').aggregate(
   [
      {
        $group : {
           _id : "$resource",
           count: { $sum: 1 }
        }
      }
   ])

*/