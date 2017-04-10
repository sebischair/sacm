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

function mxlWorkspace(workspaceId, entityTypeId, attributes, query, cb) {
    var data = {expression: 'find '+entityTypeId+' .where('+query+')'};
    http.post('/workspaces/' + workspaceId + '/mxlQuery?attributes=*&meta=', data, function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error(arguments);
            console.error('Error during mxl Query "' + JSON.stringify(data) + '"!');
            cb(err, null);
        } else {
            //console.log(JSON.stringify(body));
            cb(err, convertEntitiesToFlatJSON(attributes, body.value));
        }
    });
}

function mxlWorkspace2(workspaceId, query, attributes, cb) {
    var data = {expression: query};
    http.post('/workspaces/' + workspaceId + '/mxlQuery?attributes=*&meta=', data, function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error during mxl Query "' + JSON.stringify(data) + '"!');
            cb(err, null);
        } else {
            cb(err, body.value);//
        }
    });
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


function updateEntity(entityId, attributes, data, cb){
    http.put('/entities/'+entityId, data, function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error updating Entity "' + entityId + '"!');
            console.error(JSON.stringify(body));
        } else {
            console.log(JSON.stringify(body));
            cb(err, convertEntityToFlatJSON(attributes, body));
        }
    });
}

function deleteEntity(entityId, cb){
    http.del('/entities/'+entityId, {}, function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error deleting Entity "' + entityId + '"!');
        } else {
            cb(err);
        }
    });
}

function findEntities(entityTypeId, attributes, cb){
    http.get('/entityTypes/'+entityTypeId+'/entities?attributes=*', function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error listing all Entities "' + entityTypeId + '"!');
            console.error(body);
        } else {
            cb(err, convertEntitiesToFlatJSON(attributes, JSON.parse(body)));
        }
    });
}

function findEntityById(entityId, attributes, cb){
    http.get('/entities/'+entityId+'?attributes=*', function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error finging Entity "' + entityId + '"!');
            console.error(body);
        } else {
            cb(err, convertEntityToFlatJSON(attributes, JSON.parse(body)));
        }
    });
}

//ToDO Remove this method, not needed anymore
function findAttributesByEntityId(entityId, cb){
    http.get('/entities/'+entityId+'/attributes', function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error finging Attributes by Entity "' + entityId + '"!');
            console.error(body);
        } else {
            console.log(JSON.stringify(JSON.parse(body)));
            cb();
           // cb(err, convertEntityToFlatJSON(attributes, JSON.parse(body)));
        }
    });
}

function findAttributeIdByEntityIdAndAttibuteName(entityId, attributeName, cb){
    http.get('/entities/'+entityId+'/attributes', function (err, res, body) {
        if (err || res.statusCode != 200) {
            console.error('Error finging Attributes by Entity "' + entityId + '"!');
            console.error(body);
        } else {
            var attributes = JSON.parse(body);
            var attrId = null;
            for(var i =0; i<attributes.length; i++)
                if(attributes[i].name == attributeName) {
                    attrId = attributes[i].id;
                    break;
                }
            if(attrId != null)
                cb(err, attrId);
            else
                cb(new Error('Attribute name not found!'), null);
        }
    });
}

function createAttributeValue(entityId, attributeName, value, cb){
    findAttributeIdByEntityIdAndAttibuteName(entityId, attributeName, function(err, attrId){
        if(!err) {
            console.log(attrId);
            http.post('/attributes/' + attrId + '/values', value, function (err, res, body) {
                if (err || res.statusCode != 200) {
                    console.error('Error during creating Attribute '+attrId+' value "' + JSON.stringify(value)  + '"!');
                    console.error(body);
                    cb(err);
                } else
                    cb(err);
            });
        }else
            cb(err);
    });
}

function deleteAttributeValue(entityId, attributeName, value, cb){
    console.log('delAttibuteValue: '+entityId, attributeName, value);
    findAttributeIdByEntityIdAndAttibuteName(entityId, attributeName, function(err, attrId){
        if(!err) {
            //console.log(attrId);
            var values = [value];
            http.del('/attributes/' + attrId + '/values', values, function (err, res, body) {
                if (err || res.statusCode != 200) {
                    console.error('Error during deleting Attribute '+attrId+' values "' + JSON.stringify(values)  + '"!');
                    console.error(body);
                    cb(err);
                } else
                    cb(err);
            });
        }else
            cb(err);
    });
}

// CASE RElATED STUFF
// TODO Relook at this
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
function createHumanTaskDefinition(workspaceId, data) {
  return http.post2('/workspaces/'+workspaceId+'/stagedefinitions/', data);
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
        createOfType: createEntityOfType,
        update: updateEntity,
        delete: deleteEntity,
        findById: findEntityById
    },
    entities:{
        find: findEntities
    },
    attribute:{
        create : createAttribute,
        value:{
            create: createAttributeValue,
            delete: deleteAttributeValue
        },
        findByEntity: findAttributesByEntityId,
        findByEntityAndAttributeName: findAttributeIdByEntityIdAndAttibuteName
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
    stageDefintion: {
        create: createStageDefinition
    },
    case: {
        create: createCase,
        delete: deleteCase,
        find: findCase
    },
    cases: {
        find: findCases
    },
    mxl: mxlWorkspace,
    mxl2: mxlWorkspace2
};
