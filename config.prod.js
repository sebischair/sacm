isLoggingEnabled = true;
if(process.env.LOGGING_ENABLED !== null)
    isLoggingEnabled = process.env.LOGGING_ENABLED === 'true';

module.exports = {
    sociocortex : {
        url: process.env.SOCIOCORTEX_URL || 'SocioCortex URL not set!',
        defaultPassword: process.env.SOCIOCORTEX_DEFAULT_PASSWORD || 'ottto',
    },
    logging:{
        isEnabled: isLoggingEnabled,
        mongoUrl: process.env.MONGO_URL || 'Mongo DB for logging not set!'
    }
 };