module.exports = {
    sociocortex : {
        url: process.env.SOCIOCORTEX_URL || 'SocioCortex URL not set!',
        defaultPassword: process.env.SOCIOCORTEX_DEFAULT_PW || 'ottto',
    },
    logging:{
        isEnabled: process.env.LOGGING_ENABLED || true,
        mongoUrl: process.env.MONGO_URL || 'Mongo DB for logging not set!'
    }
 };