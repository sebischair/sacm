import express from 'express';
import pug from 'pug';



function routes(){
    const router = express.Router();

    router.use('/', (req, res)=>{
        res.send(pug.renderFile('pug\\model.pug', {itle: "some texit hfex"}))
    });



    return router;
};

export default routes;
