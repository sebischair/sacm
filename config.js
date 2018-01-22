import prod from './config.prod';
import dev from './config.dev'

if(process.env.NODE_ENV==='production')
    module.exports = prod;
else
    module.exports = dev;
