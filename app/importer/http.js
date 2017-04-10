var express = require('express');
var config = require('../../config');
var request = require('request');
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

console.log(headers.Authorization);

module.exports = {

    get: function(path, cb){
        console.log('SC-GET: '+ config.sc.url + path);
        request.get({
            url: config.sc.url + path,
            headers: headers
        }, cb);
    },
    get2: function(path){
        return new Promise(function (resolve, reject){
            console.log('SC-GET: '+ config.sc.url + path);
            request.get({
                url: config.sc.url + path,
                headers: headers
            }, function(err, res, body){
                printRequest('GET', config.sc.url+path, '', body, res!=undefined? res.statusCode: '');
                if(err || res.statusCode != 200)
                    reject(body);
                else
                    resolve(body)
            });
        });
    },
    post: function(path, data, cb){
        console.log('SC-POST: '+ config.sc.url + path + " "+JSON.stringify(data));
        request.post({
            url: config.sc.url + path,
            headers: headers,
            json: data
        }, cb);
    },
    post2: function(path, data){
        return new Promise(function (resolve, reject){
            console.log('###### POST 2 #######');
            console.log(data);
            console.log('###### POST 2 END #######');
            request.post({
                url: config.sc.url + path,
                headers: headers,
                json: data
            }, function(err, res, body){
                printRequest('POST', config.sc.url+path, data, body, res!=undefined? res.statusCode: '');
                if(err || res.statusCode != 200)
                    reject(body);
                else
                    resolve(body)
            });
        });
    },
    put: function(path, data, cb){
        console.log('SC-PUT: '+ config.sc.url + path + " "+JSON.stringify(data));
        request.put({
            url: config.sc.url + path,
            headers: headers,
            json: data
        }, cb);
    },
    del: function(path, data, cb){
        console.log('SC-DEL: '+ config.sc.url + path + " "+JSON.stringify(data));
        request.del({
            url: config.sc.url + path,
            headers: headers,
            json: data
        }, cb);
    },
    del2: function(path, data){
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
