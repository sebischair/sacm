import express from 'express';
import casedefinition from './route.casedefinition';
import stagedefinition from './route.stagedefinition';
import importer from './route.import';
import test from './route.test';


function routes(){
    console.log('here');
    const router = express.Router();
    router.use('/casedefinition', casedefinition);
    router.use('/casedefinitions', casedefinition);
    router.use('/stagedefinition', stagedefinition);
    router.use('/stagedefinitions', stagedefinition);
    router.use('/import', importer);
    router.use('/test', test);
     console.log('heree');
     return router;
};

export default routes;