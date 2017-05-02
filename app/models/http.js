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

function printRequest(method, url, reqBody, resBody, statusCode){
    if(statusCode == 200)
        console.log('SC-'+method+': '+ url + " "+colors.green(statusCode) + (url.indexOf('attributeDefinition')!=-1? resBody.name : ''));
    else{
        console.log(colors.red('SC-'+method+': '+ url + " "+statusCode));
        console.log(reqBody);
        console.log(resBody);
    }
}

function successRequest(method, url, reqBody, resBody, statusCode){
    console.log('SC-'+method+': '+ url + " "+colors.green(statusCode));
}

function errorRequest(method, url, reqBody, resBody, statusCode){
    console.log(colors.red('SC-'+method+': '+ url + " "+colors.green(statusCode)));
    console.log(reqBody);
    console.log(resBody);
}

console.log(headers.Authorization);

module.exports = {

    get: function(path){
        return new Promise(function (resolve, reject){
            rq.get({
                uri: config.sc.url +path,
                headers: headers,                
                json: true,
                resolveWithFullResponse: true 
            })
            .then(res=>{
                successRequest('GET', config.sc.url+path, '', res.body, res.statusCode);
                resolve(res.body);
            })
            .catch(res=>{
                errorRequest('GET', config.sc.url+path, '', res.error, res.statusCode);
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
    put: function(path, data, cb){
        console.log('SC-PUT: '+ config.sc.url + path + " "+JSON.stringify(data));
        return new Promise(function (resolve, reject) {
            console.log('SC-PUT: ' + config.sc.url + path + " " + JSON.stringify(data));
            request.del({
                url: config.sc.url + path,
                headers: headers,
                json: data
            }, function(err, res, body){
                printRequest('PUT', config.sc.url+path, data, body, res.statusCode);
                if(err || res.statusCode != 200)
                    reject(body);
                else
                    resolve(body)
            });
        });
    },
    del: function(path, data){
        return new Promise(function (resolve, reject) {
            console.log('SC-DEL: ' + config.sc.url + path + " " + JSON.stringify(data));
            request.del({
                url: config.sc.url + path,
                headers: headers,
                json: data
            }, function(err, res, body){
                printRequest('DEL', config.sc.url+path, data, body, res.statusCode);
                if(err || res.statusCode != 200)
                    reject(body);
                else
                    resolve(body)
            });
        });
    }
};
