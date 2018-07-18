import express from 'express';
import workspace from './workspace/route.workspace';
import casedefinition from './casedefinition/route.casedefinition';
import processdefinition from './casedefinition/route.processdefinition';
import stagedefinition from './casedefinition/route.stagedefinition';
import taskdefinition from './casedefinition/route.taskdefinition';
import humantaskdefinition from './casedefinition/route.humantaskdefinition';
import automatedtaskdefinition from './casedefinition/route.automatedtaskdefinition';
import dualtaskdefinition from './casedefinition/route.dualtaskdefinition';
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
import dualtask from './case/route.dualtask';
import entity from './data/route.entity';
import attribute from './data/route.attribute';
import userdefinition from './group/route.userdefinition';
import user from './group/route.user';
import group from './group/route.group';
import importer from './route.import';
import job from './route.job';
import analytics from './route.analytics';
import context from './route.context';

function routes(){
    const router = express.Router();

    /** UserDefinition routes */
    router.use('/userdefinitions', userdefinition);

    /** Users and Groups routes*/
    router.use('/users', user);
    router.use('/groups', group);

    /** Workspace routes*/    
    router.use('/workspaces', workspace);

    /** Entities and Attributes routes **/
    router.use('/entities', entity);
    router.use('/attributes', attribute);

    /** CaseDefinition routes */
    router.use('/casedefinitions', casedefinition);
    router.use('/processdefinitions', processdefinition);
    router.use('/stagedefinitions', stagedefinition);
    router.use('/taskdefinitions', taskdefinition);
    router.use('/humantaskdefinitions', humantaskdefinition);
    router.use('/automatedtaskdefinitions', automatedtaskdefinition);
    router.use('/dualtaskdefinitions', dualtaskdefinition);
    router.use('/taskparamdefinitions', taskparamdefinition);
    router.use('/sentrydefinitions', sentrydefinition);

    /** Case routes */
    router.use('/cases', case_);
    router.use('/stages', stage);
    router.use('/tasks', task);
    router.use('/taskparams', taskparam);
    router.use('/humantasks', humantask);
    router.use('/automatedtasks', automatedtask);
    router.use('/dualtasks', dualtask);
    router.use('/alerts', alert);
    router.use('/messages', message);
    router.use('/processes', process_);


    /** Import route */
    router.use('/import', importer);

    /** Jobs route */
    router.use('/jobs', job);

    /** Model Analytics */
    router.use('/analytics', analytics);

    /** Context route */
    router.use('/', context);

    return router;
};

export default routes;
