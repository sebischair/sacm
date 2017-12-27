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

const clients = {
  SACMFRONTEND: 'SACM.FRONTEND',
  POSTMAN: 'POSTMAN',
  NA: 'NA'
}

function allClients(){
  const arr = [];
  Object.keys(clients).forEach(k => {
    arr.push(clients[k]);
  });
  return arr;
}

function extractUrlPattern(url){
  if(url == null)
    return null;
  console.log(url.split('/'));
  url.split('/').forEach(urlSection=>{
    if(/\d/.test(urlSection) && /[A-Za-z]/.test(urlSection))
      url = url.replace(urlSection, ':id');
  })
  return url;
}

const resources = new Set(['alerts', 'automatedtasks', 'cases', 'humantasks', 'logs', 'messages', 'processes', 'stages', 'summarysections', 'tasks', 'taskparams']);
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
  client: {type: String, enum: allClients(), index: true},
  ip: {type: String, index: true},
  userAgent: {type: String, index: true},
  isMobile: {type: Boolean, index: true},
  method: {type: String, enum: allMethods(), index: true},
  url: {type: String, index: true},
  urlPattern: {type: String, index: true},
  resource: {type: String, index: true},
  body: {type: String, index: true},
  isGzipEncoding: {type: String, index: true},  
  acceptLanguage: {type: String, index: true},
  isSimulateUser: {type: Boolean, index: true}, 
  userId: {type: String, index: true},
  email: {type: String, index: true},
},{timestamps: true});

LogSchema.statics.jwtUserLog = (req, userId)=>{
  Log.log(req, false, userId, null);
}

LogSchema.statics.simulateUserLog = (req, email)=>{
  Log.log(req, true, null, email);
}

LogSchema.statics.log = (req, isSimulateUser, userId, email)=>{
  console.log('logging'+config.logging.isEnabled)
  if(!config.logging.isEnabled)
    return;
  /*
  console.log(req.rawHeaders)
  console.log(req.query)
  console.log(req.params)
  */
  let client = clients.NA;
  if(req.headers['postman-token'] != null)
    client = clients.POSTMAN;
  if(req.headers['client'] == 'sacm.fronted')
    client = clients.SACMFRONTEND;

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  let isGzipEncoding = false;
  if(req.headers['accept-encoding'] != null && req.headers['accept-encoding'].indexOf('gzip') !== -1)
    isGzipEncoding = true;

  let userAgent = req.headers['user-agent'];
  let isMobile = false;
  if (userAgent != null && /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(userAgent))
    isMobile = true;
  
  Log.create({
    client: client,
    ip: ip,
    userAgent: userAgent,
    isMobile: isMobile,
    method: req.method,
    url: req.url,
    urlPattern: extractUrlPattern(req.url),
    resource: extractResource(req.url),
    isGzipEncoding: isGzipEncoding,
    acceptLanguage: req.headers['accept-language'],
    isSimulateUser: isSimulateUser,
    userId: userId,
    email: email
  });
}

let Log = mongoose.model('Log', LogSchema);
export default Log;
