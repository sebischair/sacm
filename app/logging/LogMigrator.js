import LogMongo from "./log.mongoose.model";
import {Log as LogSql} from "./sequelize-models";
import Promise from "bluebird";
import winston from "winston/lib/winston";

module.exports = class LogMigrator {

  constructor(timestamp) {
    this.insertBatchSize = 1000;
    this.timestamp = timestamp;
  }

  async mongooseToSequelize(requestTimestamp, skip, limit, batchsize, concurrency) {
    this.insertBatchSize = batchsize;
    // noinspection EqualityComparisonWithCoercionJS
    const timestampCheckOk = this.timestamp == requestTimestamp;
    winston.debug("Got timestamp", requestTimestamp, timestampCheckOk ? " -> Check OK" : " -> Check failed");
    if (timestampCheckOk) {
      const millis = Date.now();
      const count = concurrency > 1 ? await this._migrateAllParallel(skip, limit, concurrency) : await this._migrateAll(skip, limit);
      winston.debug("Success! Migrated " + count + " records in " + (Date.now() - millis) / 1000 + " seconds.");
      return "Inserted " + count + " entities without checking for duplicates. Please do so manually by running a query like 'SELECT uuid, COUNT(*) c FROM sacmlog.Logs GROUP BY uuid HAVING c > 1;' and remove any duplicates you find.";
    }
    else
      return "Timestamp check failed. Expected: " + this.timestamp + ". Actual: " + requestTimestamp + ". Please specify the value as query parameter 'timestamp'.";
  }

  async _migrateAllParallel(skip, limit, concurrency) {
    let totalCount = 0;
    const tableLength = await LogMongo.count();
    winston.debug("MongoDB table contains " + tableLength + " records.");
    winston.debug("Migrating records " + skip + " to " + (skip + limit) + " with a batch size of " + this.insertBatchSize + " in parallel insert mode.");
    const indices = Array.from(Array(limit / this.insertBatchSize), (_, x) => skip + x * this.insertBatchSize).reverse();
    return Promise.map(indices, startIndex => {
      return LogMongo
        .find({}).skip(startIndex).limit(this.insertBatchSize).lean().exec()
        .then(logs => {
          console.log('Map find exec '+startIndex)
          return LogMigrator._doMigrate(logs)
        })
        .then(insertCount => {
          totalCount += insertCount;
          const progress = Math.round(totalCount / limit * 100);
          winston.debug("[" + progress + "%] Inserted " + totalCount + " records.");
          return totalCount;
        });
    }, {concurrency: concurrency});
  }

  async _migrateAll(skip, limit) {
    let totalCount = 0;
    const tableLength = await LogMongo.count();
    winston.debug("MongoDB table contains " + tableLength + " records.");
    winston.debug("Migrating records " + skip + " to " + (skip + limit) + " with a batch size of " + this.insertBatchSize + " in sequential insert mode.");
    for (let i = skip; i < (skip + limit); i += this.insertBatchSize) {
      const millis = Date.now();
      const logs = await LogMongo.find({}).skip(i).limit(this.insertBatchSize).exec();
      totalCount += await LogMigrator._doMigrate(logs);
      const progress = Math.round(totalCount / limit * 100);
      winston.debug("[" + progress + "%] Inserted " + totalCount + " records in " + (Date.now() - millis) / 1000 + " seconds.");
    }
    return totalCount;
  }

  static async _doMigrate(logs) {
    logs = logs.map(log => {
      log.id = null;
      log._id = null;
      log.location_countryCode = log.location && log.location.countryCode ? log.location.countryCode : null;
      log.location_country = log.location && log.location.country ? log.location.country : null;
      log.location_city = log.location && log.location.city ? log.location.city : null;
      log.location_zip = log.location && log.location.zip ? log.location.zip : null;
      log.location_lat = log.location && log.location.latitude ? log.location.latitude : null;
      log.location_lon = log.location && log.location.longitude ? log.location.longitude : null;
      log.location_accuracy = log.location && log.location.accuracy ? log.location.accuracy : null;
      return log;
    });
    await LogSql.bulkCreate(logs).catch(err => {
      if (err && err.message)
        err = err.message;
      winston.error(err);
    });
    return logs.length;
  }

};
