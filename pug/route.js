import express from 'express';
import pug from 'pug';





function routes(){
    const router = express.Router();

    router.use('/', (req, res)=>{
        
        console.log('pug');
        res.send(pug.renderFile('pug\\model.pug', {title: "some texit hfex", youAreUsingPug:true}))
    });



    return router;
};

export default routes;
