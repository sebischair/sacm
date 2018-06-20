import express from 'express';
import config from '../../config';
import rq from 'request-promise';
import Promise from 'bluebird';
import colors from 'colors';
import atob from 'atob';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import winston from 'winston';

const secret = fs.readFileSync('public.key.pem')+'';

function header(jwt){
    return {
        'Authorization': jwt,
        'Content-Type': 'application/json'
    }
}

function generateJWT(email, pw){
    return 'Basic ' + new Buffer(email + ':' + pw).toString('base64');
};

function getEmailFromJWT(jwtToken){
    return new Promise((resolve, reject)=>{
        if(jwtToken != null && jwtToken.startsWith('Basic ')){
            jwtToken = jwtToken.replace('Basic ', '');
            jwtToken = atob(jwtToken.trim());
            jwtToken = jwtToken.split(':');
            if(jwtToken.length>0)
                resolve(jwtToken[0]);
        }else if(jwtToken != null && jwtToken.startsWith('conecarebearer ')){
            jwtToken = jwtToken.replace('conecarebearer ', '');
            jwt.verify(jwtToken, secret, {algorithms: ['RS256']}, (err, decoded)=> {
                if(!err){
                    resolve(JSON.parse(decoded.user_name).username);  
                }else{
                    reject('');    
                }   
            });
        }else{
            reject(''); 
        }
    });  
};
    

function successRequest(method, url, reqBody, resBody, statusCode, start, jwt){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    getEmailFromJWT(jwt).then(email=>{
        winston.debug('SC-'+method+': '+ url + " "+colors.green(statusCode)+" "+durationInMs +" "+email);
    });    
}

function errorRequest(method, url, reqBody, resBody, statusCode, start, jwt){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    getEmailFromJWT(jwt).then(email=>{
        winston.error('email: '+email)
        winston.error(colors.red('SC-'+method+': '+ url + " "+colors.green(statusCode))+" "+durationInMs+" "+email);
        winston.error(reqBody);
        winston.error(resBody);
    }); 
}

module.exports = {

    get: function(jwt, path, params){
        const start = new Date();
        return new Promise(function (resolve, reject){
            let p = ""; 
            if(params != null){
                p += "?";
                Object.keys(params).forEach(key=>{
                    p += key+'='+params[key]+'&';
                });
            }
            rq.get({
                uri: config.sociocortex.url +path+p,
                headers: header(jwt),                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('GET', config.sociocortex.url+path+p, '', res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('GET', config.sociocortex.url+path+p, '', res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    post: function(jwt, path, data){
        const start = new Date();
        //winston.debug('###### POST 2 #######');
        winston.debug(JSON.stringify(data));
        //winston.debug('###### POST 2 END #######');
        return new Promise(function (resolve, reject){
            rq.post({
                uri: config.sociocortex.url +path,
                headers: header(jwt),
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('POST', config.sociocortex.url+path, data, res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('POST', config.sociocortex.url+path, data, res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    put: function(jwt, path, data){
        const start = new Date();
        return new Promise(function (resolve, reject){
            rq.put({
                uri: config.sociocortex.url +path,
                headers: header(jwt),
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('PUT', config.sociocortex.url+path, data, res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('PUT', config.sociocortex.url+path, data, res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    del: function(jwt, path){
        const start = new Date();
        return new Promise(function (resolve, reject){
            rq.del({
                uri: config.sociocortex.url +path,
                headers: header(jwt),                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('DEL', config.sociocortex.url+path, '', res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('DEL', config.sociocortex.url+path, '', res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    generateJWT: generateJWT
};
