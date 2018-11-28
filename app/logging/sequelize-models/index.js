import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from "../../../config";
import winston from "winston/lib/winston";
import Promise from "bluebird";

const db = {};
const sequelize = new Sequelize(config.logging.mySqlUrl, {logging: false, operatorsAliases: false});
sequelize.Promise = Promise;
sequelize.authenticate()
  .then(() => {
    fs
      .readdirSync(__dirname)
      .filter(file => file.indexOf('.') !== 0 && file.slice(-9) === '.model.js')
      .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
      });
  })
  .then(() => sequelize.sync())
  .catch((err) => {
    winston.debug(err);
    throw new Error('Unable to establishDBConnection to SACM log MySQL database: ' + config.logging.mySqlUrl);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
