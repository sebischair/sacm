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

// TaskParamDefinition
function createTaskParamDefinition(data){
  return http.post('/taskparamdefinitions/', data); 
}

module.exports = {
    entity:{
        create: createEntity,
        createOfType: createEntityOfType
    },
    attribute:{
        create : createAttribute,
    },
    taskParamDefinition: {
        create: createTaskParamDefinition
    }
};
