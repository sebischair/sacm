import mongoose from 'mongoose';
import Promise from 'bluebird';
import config from './../../config';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const methods = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS'
}

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
}

function allApplications(){
  const arr = [];
  Object.keys(applications).forEach(k => {
    arr.push(applications[k]);
  });
  return arr;
}

function extractUrlPattern(url){
  if(url == null)
    return null;
  url.split('/').forEach(urlSection=>{
    if((/\d/.test(urlSection) && /[A-Za-z]/.test(urlSection)) || 'null'==urlSection)
      url = url.replace(urlSection, ':id');
  })
  return url;
}

const resources = new Set(['import', 'workspaces', 'groups', 'users', 'entities', 'alerts', 'automatedtasks', 'cases', 'humantasks', 'logs', 'messages', 'processes', 'stages', 'summarysections', 'tasks', 'taskparams']);
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
  resBody: Mixed
},{timestamps: true});

LogSchema.statics.jwtUserLog = (req, userId, workspaceId)=>{
  Log.log(req, false, userId, null, workspaceId);
}

LogSchema.statics.simulateUserLog = (req, email)=>{
  Log.log(req, true, null, email, null);
}

LogSchema.statics.log = (req, isSimulateUser, userId, email, workspaceId)=>{
  if(!config.logging.isEnabled)
    return;

  let application = applications.NA;
  if(req.headers['postman-token'] != null)
    application = applications.POSTMAN;
  if(req.headers['application'] == applications.SACMFRONTEND.toLowerCase())
    application = applications.SACMFRONTEND;

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  let isGzip = false;
  if(req.headers['accept-encoding'] != null && req.headers['accept-encoding'].indexOf('gzip') !== -1)
  isGzip = true;

  let userAgent = req.headers['user-agent'];
  let isMobile = false;
  if (userAgent != null && /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(userAgent))
    isMobile = true;

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
    email: email,
    workspaceId: workspaceId,
    reqBody: req.body,
    uuid: req.uuid
  });
}

LogSchema.statics.setStatus = (uuid, status, duration, resBody)=>{
  const data = {status:status, duration:duration, resBody:resBody};
  Log.update({uuid:uuid, status:null}, {$set: data}, function (err){
    if (err)
      console.log(err);    
  });
}


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