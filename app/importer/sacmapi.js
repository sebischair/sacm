'use strict';
import Promise from 'bluebird';
import request from 'request-promise';

const basePath = 'http://localhost:3000/api/';

function createCaseDefinition(data){
    return request.post(basePath+'casedefinition', data);
}


module.exports = {
    createCaseDefinition
}