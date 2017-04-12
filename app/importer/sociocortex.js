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


function createCaseDefinition(data){
  return http.post('/casedefinitions/', data);
}

function findCaseDefinitions() {
  return http.get('/casedefinitions/', {});
}

function findCaseDefinition(caseDefinitionId){
  return http.get('/casedefinition/'+caseDefinitionId, {});
}

function deleteCaseDefinition() {
  return http.del('/casedefinition/'+caseDefinitionId, {});
}

// StageDefinition
function createStageDefinition(data) {
  return http.post('/stagedefinitions/', data);
}

function findStageDefinitions() {
  return http.get('/stagedefinitions/');
}

function findStageDefinition(stageDefinitionId) {
  return http.get('/stagedefinition/'+stageDefinitionId, {});
}

function deleteStageDefinition(stageDefinitionId) {
  return http.del('/stagedefinition/'+stageDefinitionId, {});
}

// HumanTaskDefinition
function createHumanTaskDefinition(data) {
  return http.post('/humantaskdefinitions/', data);
}

function getHumanTaskDefinitions(workspaceId) {
  return http.get('workspaces/'+workspaceId+'/humantaskdefinitions/');
}

function getHumanTaskDefinition(taskId) {
  return http.get('/humantaskdefinition/'+taskId, {});
}

function deleteHumanTaskDefinition(stageDefinitionId) {
  return http.del('/humantaskdefinition/'+taskId, {});
}

// AutomatedTaskDefinition
function createAutomatedTaskDefinition(data) {
  return http.post('/automatedtaskdefinitions/', data);
}

// TaskParamDefinition
function createTaskParamDefinition(data){
  return http.post('/taskparamdefinitions/', data); 
}

// CaseDefinition


module.exports = {
    entity:{
        create: createEntity,
        createOfType: createEntityOfType
    },
    attribute:{
        create : createAttribute,
    },
    caseDefinition: {
        create: createCaseDefinition,
        delete: deleteCaseDefinition,
        findById: findCaseDefinition,
        find: findCaseDefinitions
    },
    stageDefinition: {
        create: createStageDefinition,
        findById: findStageDefinition,
        find: findStageDefinitions
    },
    humanTaskDefinition:{
        create: createHumanTaskDefinition
    },
    automatedTaskDefinition: {
        create: createAutomatedTaskDefinition
    },
    taskParamDefinition: {
        create: createTaskParamDefinition
    }
};
