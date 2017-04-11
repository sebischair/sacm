var express = require('express');
var http = require('./http');
var config = require('../../config');
var Promise = require('bluebird');

function deleteWorkspace(workspaceId, ifexist){
    var p = http.del2('/workspaces/' + workspaceId, {});
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
   return http.post2('/workspaces', {name:workspaceId, id:workspaceId});
}

function createEntityType(workspaceId, typeId){
    var data = {name: typeId, namePlural: typeId};
    return http.post2('/workspaces/'+workspaceId+'/entityTypes/', data);
}

function getEntityTypes(workspaceId){
    return http.get2('/workspaces/'+workspaceId+'/entityTypes/', {});
}

function createAttributeDefinition(workspaceId, typeId, definition) {
    var data = {
        name: definition.name,
        attributeType: definition.attributeType,
        options: definition.options,
        multiplicity: definition.multiplicity
    };
    return http.post2('/entityTypes/'+typeId+'/attributeDefinitions', data);
}

function createDerivedAttributeDefinition(workspaceId, typeId, definition) {
    return http.post2('/entityTypes/'+typeId+'/derivedAttributeDefinitions', definition);
}

function createEntityOfType(entityTypeId, data){
    return http.post2('/entityTypes/'+entityTypeId+'/entities', data);
}

function createEntity(data){
    return http.post2('/entities', data);
}

function createAttribute(data){
    return http.post2('/attributes', data);
}


function createCaseDefinition(data){
  return http.post2('/casedefinitions/', data);
}

function findCaseDefinitions(workspaceId) {
  return http.get2('/workspaces/'+workspaceId+'/casedefinitions/', {});
}

function findCaseDefinition(caseDefinitionId){
  return http.get2('/casedefinition/'+caseDefinitionId, {});
}

function deleteCaseDefinition() {
  return http.del2('/casedefinition/'+caseDefinitionId, {});
}

// StageDefinition
function createStageDefinition(data) {
  return http.post2('/stagedefinitions/', data);
}

function getStageDefinitions(workspaceId) {
  return http.get2('workspaces/'+workspaceId+'/stagedefinitions/');
}

function getStageDefinition(stageDefinitionId) {
  return http.get2('/stagedefinition/'+stageDefinitionId, {});
}

function deleteStageDefinition(stageDefinitionId) {
  return http.del2('/stagedefinition/'+stageDefinitionId, {});
}

// HumanTaskDefinition
function createHumanTaskDefinition(data) {
  return http.post2('/humantaskdefinitions/', data);
}

function createAutomatedTaskDefinition(data) {
  return http.post2('/automatedtaskdefinitions/', data);
}

function getHumanTaskDefinitions(workspaceId) {
  return http.get2('workspaces/'+workspaceId+'/humantaskdefinitions/');
}

function getHumanTaskDefinition(taskId) {
  return http.get2('/humantaskdefinition/'+taskId, {});
}

function deleteHumanTaskDefinition(stageDefinitionId) {
  return http.del2('/humantaskdefinitions/'+taskId, {});
}

function createTaskParamDefinition(data){
  return http.post2('/taskparamdefinitions/', data); 
}

// CaseDefinition
function createCase(workspaceId, data){
  return http.post2('/workspaces/'+workspaceId+'/cases/', data);
}

function findCases(workspaceId) {
  return http.get2('/workspaces/'+workspaceId+'/cases/', {});
}

function findCase(caseId){
  return http.get2('/case/'+caseDefinitionId, {});
}

function deleteCase() {
  return http.del2('/case/'+caseId, {});
}


// ----

function convertEntitiesToFlatJSON(attributes, entities){
    var results = [];
    for(var i=0; i< entities.length; i++)
        results.push(convertEntityToFlatJSON(attributes, entities[i]));
    return results;
}

function convertEntityToFlatJSON(attributes, entity){
    var e = entity;
    var r = {};
    for(var j=0; j< e.attributes.length; j++) {
        var attrInst = e.attributes[j];
        var attrDef = attributes[attrInst.name];
        if(attrDef && attrDef.multiplicity  && (attrDef.multiplicity == 'many' || attrDef.multiplicity == 'any')){
            r[attrInst.name] = [];
            for(var i=0; i<attrInst.values.length; i++)
                r[attrInst.name].push(attrInst.values[i]);
        }else
            r[attrInst.name] = attrInst.values[0];
    }
    r.id = e.id;
    return r;
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
