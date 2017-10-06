import express from 'express';
import Importer from './../importer/importer';
import WorkspaceImporter from './../importer/importer.workspace';
import CaseDefinitionImporter from './../importer/importer.casedefinition';
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
 * see /workspaces
 */
router.post('/workspaces', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const wi = new WorkspaceImporter();
  const attachedFile = req.rawBody.toString('utf-8');
  const localFile = req.query.file;

  if(req.rawBody.length==0 && !localFile)
    return res.status(500).send('No file attached!')
  if(!localFile)
    return res.status(500).send('No file defined!')

  let Importer = null;
  if(req.rawBody.length>0)
    Importer = wi.importAttachedFile(req.jwt, attachedFile);
  else
    Importer = wi.importLocalFile(req.jwt, localFile);

  Importer
    .then(workspaces=>{
      res.status(200).send(workspaces);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
    
});


/**
 * @api {post} /import/casedefinition Import
 * @apiName Import
 * @apiGroup Import
 * @apiParam {string} file (mandatory) Imports the defined file
 * @apiSuccessExample {json} Success-Response:
 * see /casedefinition
 */
router.post('/casedefinition', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const cdi = new CaseDefinitionImporter();
  const attachedFile = req.rawBody.toString('utf-8');
  const localFile = req.query.file;
  const version = req.query.version;

  if(req.rawBody.length==0 && !localFile)
    return res.status(500).send('No file attached!')
  if(!localFile)
    return res.status(500).send('No file defined!')
  if(!version)
    return res.status(500).send('No version defined!')
   
  let Importer = null;
  if(req.rawBody.length>0)
    Importer = cdi.importAttachedFile(req.jwt, attachedFile, version);
  else
    Importer = cdi.importLocalFile(req.jwt, localFile, version);
  
  Importer
    .then(workspaces=>{
      res.status(200).send(workspaces);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
    
});

module.exports = router;
