import express from 'express';
import workspace from './workspace/route.workspace';
import casedefinition from './casedefinition/route.casedefinition';
import processdefinition from './casedefinition/route.processdefinition';
import stagedefinition from './casedefinition/route.stagedefinition';
import taskdefinition from './casedefinition/route.taskdefinition';
import humantaskdefinition from './casedefinition/route.humantaskdefinition';
import automatedtaskdefinition from './casedefinition/route.automatedtaskdefinition';
import taskparamdefinition from './casedefinition/route.taskparamdefinition';
import sentrydefinition from './casedefinition/route.sentrydefinition';
import alert from './case/route.alert';
import message from './case/route.message';
import process_ from './case/route.process';
import case_ from './case/route.case';
import stage from './case/route.stage';
import task from './case/route.task';
import taskparam from './case/route.taskparam';
import humantask from './case/route.humantask';
import automatedtask from './case/route.automatedtask';
import entity from './data/route.entity';
import attribute from './data/route.attribute';
import user from './group/route.user';
import group from './group/route.group';
import tenant from './group/route.tenant';
import importer from './route.import';
import test from './route.test';

function routes(){
    const router = express.Router();

    /** Users and Groups routes*/
    router.use('/user', user);
    router.use('/users', user);
    router.use('/group', group);
    router.use('/groups', group);
    router.use('/tenants', tenant);

    /** Workspace routes*/    
    router.use('/workspaces', workspace);

    /** Entities and Attributes routes **/
    router.use('/entity', entity);
    router.use('/entities', entity);
    router.use('/attribute', attribute);
    router.use('/attributes', attribute);

    /** CaseDefinition routes */
    router.use('/casedefinition', casedefinition);
    router.use('/casedefinitions', casedefinition);
    router.use('/processdefinition', processdefinition);
    router.use('/processdefinitions', processdefinition);
    router.use('/stagedefinition', stagedefinition);
    router.use('/stagedefinitions', stagedefinition);
    router.use('/taskdefinition', taskdefinition);
    router.use('/taskdefinitions', taskdefinition);
    router.use('/humantaskdefinition', humantaskdefinition);
    router.use('/humantaskdefinitions', humantaskdefinition);
    router.use('/automatedtaskdefinition', automatedtaskdefinition);
    router.use('/automatedtaskdefinitions', automatedtaskdefinition);
    router.use('/taskparamdefinition', taskparamdefinition);
    router.use('/taskparamdefinitions', taskparamdefinition);
    router.use('/sentrydefinition', sentrydefinition);
    router.use('/sentrydefinitions', sentrydefinition);

    /** Case routes */
    router.use('/case', case_);
    router.use('/cases', case_);
    router.use('/stage', stage);
    router.use('/stages', stage);
    router.use('/task', task);
    router.use('/tasks', task);
    router.use('/taskparam', taskparam);
    router.use('/taskparams', taskparam);
    router.use('/humantask', humantask);
    router.use('/humantasks', humantask);
    router.use('/automatedtask', automatedtask);
    router.use('/automatedtasks', automatedtask)
    router.use('/alert', alert);
    router.use('/alerts', alert);
    router.use('/message', message);
    router.use('/messages', message);
    router.use('/process', process_);
    router.use('/processes', process_);


    /** Import route */
    router.use('/import', importer);

    /** Other routes */
    router.use('/test', test);


    return router;
};

export default routes;
