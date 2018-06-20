let isLoggingEnabled = false;
if(process.env.LOGGING_ENABLED)
    isLoggingEnabled = process.env.LOGGING_ENABLED == 'true';
    
 module.exports = {
    sociocortex : {
        url: process.env.SOCIOCORTEX_URL || 'http://localhost:8083/api/v1',
        defaultPassword: process.env.SOCIOCORTEX_DEFAULT_PASSWORD || 'ottto',
    },
    logging:{
        isEnabled: isLoggingEnabled,
        mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/sacmlog'
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
