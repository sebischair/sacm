import maxmind from 'maxmind';
import mongoose from 'mongoose';
import winston from 'winston';
import sizeof from 'object-sizeof';
import Promise from 'bluebird';
import config from "../../config";
import RestLoggerConfig from "./rest.logger.config";
import LogMongo from "./log.mongoose.model";
import {Log as LogSql} from "./sequelize-models";
import listEndpoints from "express-list-endpoints";
import apiRoutes from "../routes/route.app";

const _routes = (function () {
  let routes = [];
  listEndpoints(apiRoutes()).forEach(endpoint => {
    if (routes.indexOf(endpoint.path) < 0)
      routes.push(endpoint.path);
  });
  return routes.sort().reverse().map(endpoint => endpoint.split('/'));
})();

class RestLogger {

  static _cityLookup;

  /**
   * Establishes the database connection(s). Needs to be called once on init.
   */
  static establishDBConnection() {
    RestLogger._cityLookup = maxmind.openSync(__dirname + '/db', {cache: {max: 500}});
    mongoose.Promise = Promise;
    mongoose.connection.on('error', () => {
      throw new Error('Unable to establishDBConnection to SACM log Mongo database: ' + config.logging.mongoUrl);
    });
    mongoose.connect(config.logging.mongoUrl, {useMongoClient: true});
  }

  /**
   * Creates a new REST log entry for JWT authenticated users
   */
  static jwtUserLog(req, userId, userName, workspaceId) {
    RestLogger._doLog(req, false, userId, userName, null, workspaceId);
  }

  /**
   * Creates a new REST log entry for users with simulated authentication
   */
  static simulateUserLog(req, email) {
    RestLogger._doLog(req, true, null, null, email, null);
  }

  /**
   * Updates an existing REST log entry after the request has been served
   */
  static setStatus(uuid, status, duration, resBody) {
    if (!config.logging.isEnabled)
      return;
    let resBodyLog = null;
    if (status !== 200)
      resBodyLog = resBody;

    let resBodySize = 0;
    if (resBody)
      resBodySize = sizeof(resBody);

    const data = {status: status, duration: duration, resBody: resBodyLog, resBodySize: resBodySize};
    if (LogMongo)
      LogMongo.update({uuid: uuid, status: null}, {$set: data}).catch(err => winston.debug(err));
    else
      winston.debug("Updating REST log entry prevented, mongoose DAO is undefined");
    if (LogSql)
      LogSql.update(data, {where: {uuid: uuid, status: null}}).catch(err =>{
        setTimeout(function(){ 
          LogSql.update(data, {where: {uuid: uuid, status: null}}).catch(err =>{
            setTimeout(function(){ 
              LogSql.update(data, {where: {uuid: uuid, status: null}}).catch(err =>{
                setTimeout(function(){ 
                  LogSql.update(data, {where: {uuid: uuid, status: null}}).catch(err =>{
                    winston.error(err);
                  });
                }, 1000);        
              });
            }, 100);        
          });
        }, 10);        
      });
    else
      winston.debug("Updating REST log entry prevented, sequelize DAO is undefined");
  }

  // --------------- HELPER FUNCTIONS --------------- //

  static _doLog(req, isSimulateUser, userId, userName, email, workspaceId) {
    if (!config.logging.isEnabled)
      return;
    let application = RestLoggerConfig.applications.NA;
    if (req.headers['postman-token'] != null)
      application = RestLoggerConfig.applications.POSTMAN;
    if (req.headers['application'] === RestLoggerConfig.applications.SACMFRONTEND.toLowerCase())
      application = RestLoggerConfig.applications.SACMFRONTEND;
    if (req.headers['application'] === RestLoggerConfig.applications.UIM.toLowerCase())
      application = RestLoggerConfig.applications.UIM;
    if (req.headers['application'] === RestLoggerConfig.applications.SMS.toLowerCase())
      application = RestLoggerConfig.applications.SMS;

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let isGzip = false;
    if (req.headers['accept-encoding'] != null && req.headers['accept-encoding'].indexOf('gzip') !== -1)
      isGzip = true;

    let userAgent = req.headers['user-agent'];
    let isMobile = false;
    if (userAgent != null && /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(userAgent))
      isMobile = true;

    let reqBodySize = 0;
    if (req.body)
      reqBodySize = sizeof(req.body);

    const logEntry = {
      application: application,
      ip: ip,
      userAgent: userAgent,
      isMobile: isMobile,
      method: req.method,
      url: req.url,
      urlPattern: RestLogger._extractUrlPattern(req.url),
      resource: RestLogger._extractResource(req.url),
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
      location: RestLogger._ip2Location(ip)
    };
    const location = logEntry.location;
    logEntry.location_countryCode = location && location.countryCode ? location.countryCode : null;
    logEntry.location_country = location && location.country ? location.country : null;
    logEntry.location_city = location && location.city ? location.city : null;
    logEntry.location_zip = location && location.zip ? location.zip : null;
    logEntry.location_lat = location && location.latitude ? location.latitude : null;
    logEntry.location_lon = location && location.longitude ? location.longitude : null;
    logEntry.location_accuracy = location && location.accuracy ? location.accuracy : null;
    // TODO add some retry logic
    if (LogMongo)
      LogMongo.create(logEntry).catch(err => winston.debug(err));
    else
      winston.error("Creating REST log entry prevented, mongoose DAO is undefined");
    if (LogSql)
      LogSql.create(logEntry).catch(err => winston.debug(err));
    else
      winston.error("Creating REST log entry prevented, sequelize DAO is undefined");
  }

  static _extractUrlPattern(url) {
    let urlPattern = "";
    if (url == null)
      return urlPattern;
    if (url.indexOf('?') > -1)    // remove query params
      url = url.substring(0, url.indexOf('?'));
    while (url.length > 1 && url.lastIndexOf('/') === url.length - 1)   // remove trailing slashes
      url = url.substring(0, url.length - 1);
    let splitUrl = url.split('/');
    _routes.some(splitRoute => {
      if (splitRoute.length === splitUrl.length) {
        let differencesDetected = splitRoute.some((routeSubPath, index) => routeSubPath.indexOf(':') !== 0 && routeSubPath !== splitUrl[index]);
        if (!differencesDetected)
          urlPattern = splitRoute.join('/');
        return !differencesDetected;
      }
    });
    return urlPattern;
  }

  static _extractResource(urlPattern) {
    if (urlPattern == null)
      return;
    const urlSections = urlPattern.split('/');
    for (let i = urlSections.length - 1; i > 0; i--) {
      if (RestLoggerConfig.resources.has(urlSections[i]))
        return urlSections[i];
    }
    return null;
  }

  static _ip2Location(ip) {
    let l = RestLogger._cityLookup.get(ip);
    let r = {
      countryCode: null,
      country: null,
      city: null,
      zip: null,
      latitude: null,
      longitude: null,
      accuracy: null
    };
    if (l && l.city && l.city.names)
      r.city = l.city.names.en;
    if (l && l.country && l.country.names)
      r.country = l.country.names.en;
    if (l && l.location && l.location) {
      r.latitude = l.location.latitude;
      r.longitude = l.location.longitude;
      r.accuracy = l.location.accuracy_radius;
    }
    if (l && l.postal)
      r.zip = l.postal.code;
    if (l && l.country)
      r.countryCode = l.country.iso_code;
    //winston.debug(ip+" "+r.country+" ("+r.countryCode+") "+r.zip+" "+r.city+" "+r.latitude+" "+r.longitude+" "+r.accuracy)
    return r;
  }

}

export default RestLogger;
