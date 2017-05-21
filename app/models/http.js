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

function successRequest(method, url, reqBody, resBody, statusCode){
    console.log('SC-'+method+': '+ url + " "+colors.green(statusCode));
}

function errorRequest(method, url, reqBody, resBody, statusCode){
    console.log(colors.red('SC-'+method+': '+ url + " "+colors.green(statusCode)));
    console.log(reqBody);
    console.log(resBody);
}

module.exports = {

    get: function(path, params){
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
                headers: headers,                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('GET', config.sc.url+path+p, '', res.body, res.statusCode);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('GET', config.sc.url+path+p, '', res.error, res.statusCode);
                reject(res.error);
            });          
        });
    },
    post: function(path, data){
        console.log('###### POST 2 #######');
        console.log(JSON.stringify(data));
        console.log('###### POST 2 END #######');
        return new Promise(function (resolve, reject){
            rq.post({
                uri: config.sc.url +path,
                headers: headers,
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('POST', config.sc.url+path, data, res.body, res.statusCode);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('POST', config.sc.url+path, data, res.error, res.statusCode);
                reject(res.error);
            });          
        });
    },
    put: function(path, data){
        return new Promise(function (resolve, reject){
            rq.put({
                uri: config.sc.url +path,
                headers: headers,
                body: data,
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('PUT', config.sc.url+path, data, res.body, res.statusCode);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('PUT', config.sc.url+path, data, res.error, res.statusCode);
                reject(res.error);
            });          
        });
    },
    del: function(path){
        return new Promise(function (resolve, reject){
            rq.del({
                uri: config.sc.url +path,
                headers: headers,                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('DEL', config.sc.url+path, '', res.body, res.statusCode);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('DEL', config.sc.url+path, '', res.error, res.statusCode);
                reject(res.error);
            });          
        });
    }
};
