import express from 'express';
import pug from 'pug';



function routes(){
    const router = express.Router();

    router.use('/xml', (req, res)=>{
        res.send(pug.renderFile('pug\\model.pug', {active: 'xml'}))
    });

    router.use('/', (req, res)=>{
        res.send(pug.renderFile('pug\\model.pug', {active: 'model'}))
    });



    return router;
};

export default routes;
