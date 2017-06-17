import express from 'express';
import pug from 'pug';


function renderSection(section){
    return pug.renderFile('doc2\\sections\\'+section+'.pug', {active: section})
}

function routes(){
    const router = express.Router();
    
    router.use('/doc2/architecture', (req, res)=>{
        res.send(renderSection('architecture'))
    });

    router.use('/doc2/model', (req, res)=>{
        res.send(renderSection('model'))
    });

    router.use('/doc2/howtostart', (req, res)=>{
        res.send(renderSection('howtostart'))
    });

    router.use('/doc2/api', (req, res)=>{
        res.send(renderSection('api'))
    });

    router.use('/', (req, res)=>{
        res.send(renderSection('index'))
    });



    return router;
};

export default routes;
