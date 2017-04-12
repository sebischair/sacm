import express from 'express';
import casedefinition from './casedefinition/route.casedefinition';
import stagedefinition from './casedefinition/route.stagedefinition';
import humantaskdefinition from './casedefinition/route.humantaskdefinition';
import automatedtaskdefinition from './casedefinition/route.automatedtaskdefinition';
import sentrydefinition from './casedefinition/route.sentrydefinition';
import case1 from './case/route.case';
import stage from './case/route.stage';
import humantask from './case/route.humantask';
import automatedtask from './case/route.automatedtask';
import importer from './route.import';
import test from './route.test';

function routes(){
    const router = express.Router();

    /** CaseDefinition routes *
    router.use('/casedefinition', casedefinition);
    router.use('/casedefinitions', casedefinition);
    router.use('/stagedefinition', stagedefinition);
    router.use('/stagedefinitions', stagedefinition);
    router.use('/humantaskdefinition', humantaskdefinition);
    router.use('/humantaskdefinitions', humantaskdefinition);
    router.use('/automatedtaskdefinition', automatedtaskdefinition);
    router.use('/automatedtaskdefinitions', automatedtaskdefinition);
    router.use('/sentrydefinition', sentrydefinition);
    router.use('/sentrydefinitions', sentrydefinition);

    /** Case routes *
    router.use('/case', case1);
    router.use('/cases', case1);
    router.use('/stage', stage);
    router.use('/stages', stage);
    router.use('/humantask', stage);
    router.use('/humantasks', stage);
    router.use('/automatedtask', stage);
    router.use('/automatedtasks', stage);
    */

    /** Import route */
    router.use('/import', importer);

    /** Other routes */
    router.use('/test', test);

    
    return router;
};

export default routes;