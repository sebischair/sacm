var express = require('express');
var http = require('./http');
var config = require('../../config');
var Promise = require('bluebird');

function deleteWorkspace(workspaceId, ifexist){
    var p = http.del('/workspaces/' + workspaceId, {});
    if(ifexist){
        return new Promise(function (resolve, reject) {
            p.then(()=>{ resolve(); });
            p.catch(()=>{ resolve(); });
        });
    }else{
       return p;
    }
}

function createWorkspace(workspaceId){
   return http.post('/workspaces', {name:workspaceId, id:workspaceId});
}

function createEntityType(workspaceId, typeId){
    var data = {name: typeId, namePlural: typeId};
    return http.post('/workspaces/'+workspaceId+'/entityTypes/', data);
}

function getEntityTypes(workspaceId){
    return http.get('/workspaces/'+workspaceId+'/entityTypes/', {});
}

function createAttributeDefinition(workspaceId, typeId, definition) {
    var data = {
        name: definition.name,
        attributeType: definition.attributeType,
        options: definition.options,
        multiplicity: definition.multiplicity
    };
    return http.post('/entityTypes/'+typeId+'/attributeDefinitions', data);
}

function createDerivedAttributeDefinition(workspaceId, typeId, definition) {
    return http.post('/entityTypes/'+typeId+'/derivedAttributeDefinitions', definition);
}

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

function findCaseDefinitions(workspaceId) {
  return http.get('/workspaces/'+workspaceId+'/casedefinitions/', {});
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

function getStageDefinitions(workspaceId) {
  return http.get('workspaces/'+workspaceId+'/stagedefinitions/');
}

function getStageDefinition(stageDefinitionId) {
  return http.get('/stagedefinition/'+stageDefinitionId, {});
}

function deleteStageDefinition(stageDefinitionId) {
  return http.del('/stagedefinition/'+stageDefinitionId, {});
}

// HumanTaskDefinition
function createHumanTaskDefinition(data) {
  return http.post('/humantaskdefinitions/', data);
}

function createAutomatedTaskDefinition(data) {
  return http.post('/automatedtaskdefinitions/', data);
}

function getHumanTaskDefinitions(workspaceId) {
  return http.get('workspaces/'+workspaceId+'/humantaskdefinitions/');
}

function getHumanTaskDefinition(taskId) {
  return http.get('/humantaskdefinition/'+taskId, {});
}

function deleteHumanTaskDefinition(stageDefinitionId) {
  return http.del('/humantaskdefinitions/'+taskId, {});
}

function createTaskParamDefinition(data){
  return http.post('/taskparamdefinitions/', data); 
}

// CaseDefinition
function createCase(workspaceId, data){
  return http.post('/workspaces/'+workspaceId+'/cases/', data);
}

function findCases(workspaceId) {
  return http.get('/workspaces/'+workspaceId+'/cases/', {});
}

function findCase(caseId){
  return http.get('/case/'+caseDefinitionId, {});
}

function deleteCase() {
  return http.del('/case/'+caseId, {});
}

module.exports = {
    workspace:{
        create: createWorkspace,
        delete: deleteWorkspace
    },
    entityType:{
        find: getEntityTypes,
        create: createEntityType
    },
    attributeDefinition:{
        create: createAttributeDefinition
    },
    entity:{
        create: createEntity,
        createOfType: createEntityOfType
    },
    entities:{
        find: false
    },
    attribute:{
        create : createAttribute,
    },
    derivedAttributeDefinition:{
        create: createDerivedAttributeDefinition
    },
    caseDefinition: {
        create: createCaseDefinition,
        delete: deleteCaseDefinition,
        find: findCaseDefinition
    },
    caseDefinitions: {
        find: findCaseDefinitions
    },
    stageDefinition: {
        create: createStageDefinition
    },
    humanTaskDefinitions:{
        create: createHumanTaskDefinition
    },
    taskParamDefinitions:{
        create: createTaskParamDefinition
    },
    automatedTaskDefinitions: {
        create: createAutomatedTaskDefinition
    },
    case: {
        create: createCase,
        delete: deleteCase,
        find: findCase
    },
    cases: {
        find: findCases
    }
};
