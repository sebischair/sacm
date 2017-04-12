var express = require('express');
var http = require('../scmodels/http');
var config = require('../../config');
var Promise = require('bluebird');


function createEntityOfType(entityTypeId, data){
    return http.post('/entityTypes/'+entityTypeId+'/entities', data);
}

function createEntity(data){
    return http.post('/entities', data);
}

function createAttribute(data){
    return http.post('/attributes', data);
}

module.exports = {
    entity:{
        create: createEntity,
        createOfType: createEntityOfType
    },
    attribute:{
        create : createAttribute,
    }
};
