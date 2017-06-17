import express from 'express';
import pug from 'pug';
import fs from 'fs';


function renderSection(section){
    return pug.renderFile('doc\\sections\\'+section+'.pug', {active: section})
}

function routes(){
    const router = express.Router();
    
    router.use('/doc/architecture', (req, res)=>{
        res.send(renderSection('architecture'))
    });

    router.use('/doc/model', (req, res)=>{
        res.send(renderSection('model'))
    });

    router.use('/doc/gettingstarted', (req, res)=>{
        res.send(renderSection('gettingstarted'))
    });

    router.use('/doc/api', (req, res)=>{
        res.send(renderSection('api'))
    });

    router.use('/doc/apicontent', (req, res)=>{    
        res.send(fs.readFileSync('/doc/dist/index.html'))
    });

    router.use('/', (req, res)=>{
        res.send(renderSection('index'))
    });



    return router;
};

export default routes;
