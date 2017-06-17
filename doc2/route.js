import express from 'express';
import pug from 'pug';


function renderSection(section){
    return pug.renderFile('doc2\\sections\\'+section+'.pug', {active: section})
}

function routes(){
    const router = express.Router();
    
    router.use('/architecture', (req, res)=>{
        res.send(renderSection('architecture'))
    });

    router.use('/model', (req, res)=>{
        res.send(renderSection('model'))
    });

    router.use('/', (req, res)=>{
        res.send(renderSection('xml'))
    });



    return router;
};

export default routes;
