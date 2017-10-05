import express from 'express';
import Importer from './../importer/importer';
import WorkspaceImporter from './../importer/importer.workspace';
import http from './../models/http';
const router = express.Router();

/**
 * @api {post} /import/all Import
 * @apiName Import
 * @apiGroup Import
 * @apiParam {boolean} execute (optional) Executes the imported case if an executed is specified within the xml file, false by default
 * @apiParam {string} file (optional) Importes the defined file, by default imports the democase.xml
 * @apiSuccessExample {json} Success-Response:
 * see case/:id/tree route 
 */
router.post('/all', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const xml = new Importer();
  let file = 'democase.xml';
  let isExecuteCase = false;
  let executionJwt = req.jwt;

  if(req.body.file)
    file = req.body.file;
  if(req.body.execute)
    isExecuteCase = true;
  if(req.body.executionUser){
    executionJwt = http.generateJWT(req.body.executionUser, 'ottto');
  }

  xml.import(req.jwt, file, isExecuteCase, executionJwt)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});


/**
 * @api {post} /import/workspaces Import
 * @apiName Import
 * @apiGroup Import
 * @apiParam {string} file (mandatory) Imports the defined file
 * @apiSuccessExample {json} Success-Response:
 * TBD
 */
router.post('/workspaces', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const wi = new WorkspaceImporter();
  const attachedFile = req.rawBody.toString('utf-8');
  
  if(req.rawBody.length==0 && !req.query.file)
    return res.status(500).send('No file attached!')
  if(!req.query.file)
    return res.status(500).send('No file defined!')

  wi.import(req.jwt, req.query.file)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
    
});

module.exports = router;
