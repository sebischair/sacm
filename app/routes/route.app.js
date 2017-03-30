import express from 'express';
import casedefinition from './route.casedefinition';
import stagedefinition from './route.stagedefinition';
import humantaskdefinition from './route.humantaskdefinition';
import sentrydefinition from './route.sentrydefinition';
import importer from './route.import';
import test from './route.test';

function routes(){
    const router = express.Router();

    /** CaseDefintion routes */
    router.use('/casedefinition', casedefinition);
    router.use('/casedefinitions', casedefinition);
    router.use('/stagedefinition', stagedefinition);
    router.use('/stagedefinitions', stagedefinition);
    router.use('/sentrydefinition', sentrydefinition);
    router.use('/sentrydefinitions', sentrydefinition);

    /** Case routes */

    /** Import route */
    router.use('/import', importer);

    /** Other routes */
    router.use('/test', test);

    
    return router;
};

export default routes;