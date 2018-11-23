let isLoggingEnabled = true;
if(process.env.LOGGING_ENABLED)
    isLoggingEnabled = process.env.LOGGING_ENABLED == 'true';

module.exports = {
    sociocortex : {
        url: process.env.SOCIOCORTEX_URL || 'SocioCortex URL not set!',
        defaultPassword: process.env.SOCIOCORTEX_DEFAULT_PASSWORD || 'ottto',
    },
    logging:{
        isEnabled: isLoggingEnabled,
        mongoUrl: process.env.MONGO_URL || 'Mongo DB for logging not set!',
        mySqlUrl: process.env.MYSQL_URL || 'MySQL DB for logging not set!',
    },
    winston:{
        console:{
            level: process.env.WINSTON_CONSOLE_LEVEL || 'silly'
        },
        file:{
            level: process.env.WINSTON_FILE_LEVEL || 'error',
            path: process.env.WINSTON_FILE_PATH || 'sacm.backend.log'
        }
    }
 };