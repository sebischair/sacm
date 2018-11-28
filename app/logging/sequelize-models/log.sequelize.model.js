import RestLoggerConfig from "../rest.logger.config";

export default (sequelize, DataTypes) => {
  return sequelize.define('Log', {
    application: {type: DataTypes.ENUM(Object.values(RestLoggerConfig.applications))},
    ip: {type: DataTypes.STRING(60)},
    userAgent: {type: DataTypes.STRING(500)},
    isMobile: {type: DataTypes.BOOLEAN},
    method: {type: DataTypes.ENUM(RestLoggerConfig.methods)},
    url: {type: DataTypes.STRING(255)},
    urlPattern: {type: DataTypes.STRING},
    resource: {type: DataTypes.STRING(45)},
    isGzip: {type: DataTypes.BOOLEAN},
    isSimulateUser: {type: DataTypes.BOOLEAN},
    userId: {type: DataTypes.STRING(45)},
    username: {type: DataTypes.STRING(255)},
    email: {type: DataTypes.STRING(255)},
    workspaceId: {type: DataTypes.STRING(45)},
    reqBody: {type: DataTypes.JSON},
    reqBodySize: {type: DataTypes.INTEGER(11)},
    uuid: {type: DataTypes.STRING(45)},
    location_countryCode: {type: DataTypes.STRING(45)},
    location_country: {type: DataTypes.STRING(45)},
    location_city: {type: DataTypes.STRING(45)},
    location_zip: {type: DataTypes.STRING(45)},
    location_lat: {type: DataTypes.DOUBLE},
    location_lon: {type: DataTypes.DOUBLE},
    location_accuracy: {type: DataTypes.INTEGER(11)},
    duration: {type: DataTypes.INTEGER(11)},
    resBody: {type: DataTypes.JSON},
    resBodySize: {type: DataTypes.INTEGER(11)},
    status: {type: DataTypes.INTEGER(11)},
    acceptLanguage: {type: DataTypes.STRING(500)}
  });
};
