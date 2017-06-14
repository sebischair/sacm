var express = require('express');
var config = require('../../config');
var request = require('request');
import rq from 'request-promise';
var Promise = require('bluebird');
var colors = require('colors');

var headers = {
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

function successRequest(method, url, reqBody, resBody, statusCode, start){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    console.log('SC-'+method+': '+ url + " "+colors.green(statusCode)+" "+durationInMs);
}

function errorRequest(method, url, reqBody, resBody, statusCode, start){
    const durationInMs = +(new Date().getTime()-start.getTime())+"ms";
    console.log(colors.red('SC-'+method+': '+ url + " "+colors.green(statusCode))+" "+durationInMs);
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
                successRequest('GET', config.sc.url+path+p, '', res.body, res.statusCode, start);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('GET', config.sc.url+path+p, '', res.error, res.statusCode, start);
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
                successRequest('POST', config.sc.url+path, data, res.body, res.statusCode, start);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('POST', config.sc.url+path, data, res.error, res.statusCode, start);
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
                successRequest('PUT', config.sc.url+path, data, res.body, res.statusCode, start);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('PUT', config.sc.url+path, data, res.error, res.statusCode, start);
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
                successRequest('DEL', config.sc.url+path, '', res.body, res.statusCode, start);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('DEL', config.sc.url+path, '', res.error, res.statusCode, start);
                reject(res.error);
            });          
        });
    }
};
