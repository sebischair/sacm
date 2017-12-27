isLoggingEnabled = false;
if(process.env.LOGGING_ENABLED !== null)
    isLoggingEnabled = process.env.LOGGING_ENABLED === 'true';

 module.exports = {
    sociocortex : {
        url: process.env.SOCIOCORTEX_URL || 'http://localhost:8083/api/v1',
        defaultPassword: process.env.SOCIOCORTEX_DEFAULT_PASSWORD || 'ottto',
    },
    logging:{
        isEnabled: process.env.LOGGING_ENABLED || true,
        mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/sacmlog'
    }
 };
