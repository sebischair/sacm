import mongoose from 'mongoose';
import RestLoggerConfig from "./rest.logger.config";

const LogSchema = new mongoose.Schema({
  application: {type: String, enum: Object.values(RestLoggerConfig.applications), index: true},
  ip: {type: String, index: true},
  userAgent: {type: String, index: true},
  isMobile: {type: Boolean, index: true},
  method: {type: String, enum: RestLoggerConfig.methods, index: true},
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
  reqBody: mongoose.Schema.Types.Mixed,
  reqBodySize: Number,
  resBody: mongoose.Schema.Types.Mixed,
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
}, {timestamps: true});

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