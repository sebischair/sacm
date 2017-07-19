import express from 'express';
import pug from 'pug';
import fs from 'fs';
import rq from 'request-promise';


function renderSection(section){
    return pug.renderFile('doc/sections/'+section+'.pug', {active: section})
}

function routes(){
    const router = express.Router();
    
    router.use('/architecture', (req, res)=>{
        res.send(renderSection('architecture'))
    });

    router.use('/model', (req, res)=>{
        res.send(renderSection('model'))
    });

    router.use('/gettingstarted', (req, res)=>{
        res.send(renderSection('gettingstarted'))
    });

    router.use('/api', (req, res)=>{
        res.send(renderSection('api'))
    });

    router.use('/apicontent', (req, res)=>{    
        res.send(fs.readFileSync('/doc/dist/index.html'))
    });

    router.use('/postman', (req, res)=>{
        res.send(renderSection('postman'))
    });

    router.use('/postmancontent2/docs-assets', (req, res)=>{
        const path = req.originalUrl.replace(req.baseUrl, '');
        rq.get('https://documenter.getpostman.com/docs-assets/'+path)
            .then(data=>{   
                data = data.replace(/\/api/gi, '/doc/postmancontent2/api');                
                if(path != null){
                    let contentType = null;
                    if(path.endsWith('.js'))
                        contentType = 'text/javascript';
                    if(path.endsWith('.css'))
                        contentType = 'text/css'
                    if(contentType != null)
                        res.setHeader('content-type', contentType);
                }
                res.send(data);
            })
            .catch(err=>{
                res.status(500).send(err);
            });      
    });

    router.use('/postmancontent2/api', (req, res)=>{
        const path = req.originalUrl.replace(req.baseUrl, '');
        const c = "__unam=7d3557e-15c867c3aec-7dd2d9e4-1; _ga=GA1.3.7379645.1490862991; sails.sid=s%3AmH00dUodDlLlDLoeXFvmqkb-0BVghQ3p.9i0qktUArmOJXHj8KMof1yOLUqS1%2BIIne06lN2MMfdY; getpostmanlogin=yes; _mkto_trk=id:067-UMD-991&token:_mch-getpostman.com-1490862991446-55135; postman.sid=04e4310108af92bd7df37641678b289e7444247eb7d8a1d786016cc19ac0129c6bac0a91eed0c3cb812eeb7757f4c18a384f096b2b6685e2d893f7573c299124f2132ecc1dbdb54a921b7f114ce1bfaec854c5d18edbbc877ceae2fe4ab84009b07eb9f564c89d0a4f4388df53b7eb81934f8f44c8089a6badf3c9f1f242ff309e38ea75d41176af2468f59e2f0f3d6282c27e618f5bb407d47a7e2318997ef2589e318489ef04895be7608f70ec8b5acf568abf6f5239d84154c108aeca142b4d41c93f1ff436b65a70ef3b7203a8cf2fa92c67f1e4fabe2052c2c7cd97fd74822de892a7bb76036720a04502c907959ae528df7e4b4ec5a0d8a79f25c18a47c8a69faf94a3a88a1f76e4de84ebdac6852e68003102df937ea8db9d51380f6d9b846629ac6f4e34ff6ea81b6bbe98724ba3ec65839418c18683f440479650ad10babf5bd4aa7f26140758fe40b5d026251cc55617ca1365087c5243d39a11dc98014f5a193f58fc691018d0e363df55592c33365a897cbb83a9e077209b41a207adad315d8174135aedd6eec5fa43a2e9512a4ceaec8c3883c04a361e7941ab7dab420574a4b9e1d2075788ae041d0b3a212d83ebf8a7a22d2bd8adb4a25001ef18673d2c30c8c01651d4278b3c157ade87cc0ed1332072efe35a9f270fd7744d513da2b55a3ea810bb5395521191e87102ad7d81a81164cbd060abbdc0f56e0559852310d0a922f026a62e255f266ee3e65c337a77f85eda902a746881e763eae83a983691481a9c48cb0fc3fa8e5c979bc3f4227a6483da0ca5b25a0ca2a13821815f1b9b3a8afbf661760ddd3d4a89e1724616208e199354064e89342f922bdc951fb530d752e1d09450ffc46397462928a1bc3b9888c06a4111c1385bad86ead7fc5d364c30b8fff44787effc2a05ecd5ac681e78cd7e29edec0b6a6b30d91c2326813d8a13fa33ba11bfb27933853c87f4b1501dae2d32ecf5c612804d2ba2f0244e848de7c8e4fd035380fc88e63b227b766f1de63fe78f4584ac672a05e1cd9d42d477535cfd0048c6a80917d06099f0a111f52e6a5a1518f3c55a20cbcdfcee4efc35d2ef8791a1ea1f11d5a117c20cc35dda935dbac78169977698e6a961c0ff1631bd12089a2b7d5c53dbd7ec3426f05714751a1e17a81ebe19decccbe25c14dc3ba8468b3eab4c70a0458e9ea6f9d14af367bab93cc76564952c17252ea1b8a4900d6ec713fdd6dd1f2d8e5776d51089fe731fd05df0684792; _ga=GA1.2.7379645.1490862991; _gid=GA1.2.327254196.1500383360";
        rq.get({uri:'https://documenter.getpostman.com/api/'+path, headers:{cookie: c}})
            .then(data=>{            
                res.setHeader('content-type', 'text/html'); 
                res.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36');                   
                res.send(data);
            })
            .catch(err=>{
                res.status(500).send(err);
            });      
    });

    router.use('/postmancontent', (req, res)=>{
        rq.get('https://documenter.getpostman.com/view/1815062/sacm/6Z3tXf7')
            .then(data=>{   
                data = data.replace(/\/docs-assets/gi, '/doc/postmancontent2/docs-assets')
                res.send(data);
            })
            .catch(err=>{
                res.status(500).send(err);
            });      
    });


    router.use('/', (req, res)=>{
        res.send(renderSection('index'))
    });



    return router;
};

export default routes;
