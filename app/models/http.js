import express from 'express';
import config from '../../config';
import rq from 'request-promise';
import Promise from 'bluebird';
import colors from 'colors';
import atob from 'atob';

const headers = {
    'Authorization': 'Basic ' + new Buffer(config.sc.user + ':' + config.sc.pass).toString('base64'),
    'Content-Type': 'application/json'
};
console.log(headers);

function header(jwt){
    return {
        'Authorization': jwt,
        'Content-Type': 'application/json'
    }
}

function generateJWT(email, pw){
    return 'Basic ' + new Buffer(email + ':' + pw).toString('base64');
};

function getEmailFromJWT(jwt){
    if(jwt != null && jwt.startsWith('Basic ')){
        jwt = jwt.replace('Basic ', '');
        jwt = atob(jwt.trim());
        jwt = jwt.split(':');
        if(jwt.length>0)
            return jwt[0];
    }
    return '';   
};
    

function successRequest(method, url, reqBody, resBody, statusCode, start, jwt){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    const email = getEmailFromJWT(jwt);
    console.log('SC-'+method+': '+ url + " "+colors.green(statusCode)+" "+durationInMs +" "+email);
}

function errorRequest(method, url, reqBody, resBody, statusCode, start, jwt){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    const email = getEmailFromJWT(jwt);
    console.log(colors.red('SC-'+method+': '+ url + " "+colors.green(statusCode))+" "+durationInMs+" "+email);
    console.log(reqBody);
    console.log(resBody);
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
                uri: config.sc.url +path+p,
                headers: header(jwt),                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('GET', config.sc.url+path+p, '', res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('GET', config.sc.url+path+p, '', res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    post: function(jwt, path, data){
        const start = new Date();
        console.log('###### POST 2 #######');
        console.log(JSON.stringify(data));
        console.log('###### POST 2 END #######');
        return new Promise(function (resolve, reject){
            rq.post({
                uri: config.sc.url +path,
                headers: header(jwt),
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('POST', config.sc.url+path, data, res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('POST', config.sc.url+path, data, res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    put: function(jwt, path, data){
        const start = new Date();
        return new Promise(function (resolve, reject){
            rq.put({
                uri: config.sc.url +path,
                headers: header(jwt),
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('PUT', config.sc.url+path, data, res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('PUT', config.sc.url+path, data, res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    del: function(jwt, path){
        const start = new Date();
        return new Promise(function (resolve, reject){
            rq.del({
                uri: config.sc.url +path,
                headers: header(jwt),                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('DEL', config.sc.url+path, '', res.body, res.statusCode, start, jwt);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('DEL', config.sc.url+path, '', res.error, res.statusCode, start, jwt);
                reject(res.error);
            });          
        });
    },
    generateJWT: generateJWT
};
