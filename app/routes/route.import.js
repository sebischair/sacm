import express from 'express';
import winston from 'winston';
import WorkspaceImporter from './../importer/importer.workspace';
import CaseDefinitionImporter from './../importer/importer.casedefinition';
const router = express.Router();


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
  const isAttachedFile = req.rawBody.length>200;
  const localFile = req.query.file;
  const isLocalFile = localFile != null;

  if(!isAttachedFile && !localFile)
    return res.status(500).send('No local file defined AND no file attached!')
  if(isAttachedFile && localFile)
    return res.status(500).send('Local file defined AND file attached!')

  let Importer = null;
  if(isAttachedFile)
    Importer = wi.importAttachedFile(req.jwt, attachedFile);
  else
    Importer = wi.importLocalFile(req.jwt, localFile);

  Importer
    .then(workspaces=>{
      res.status(200).send(workspaces);
    })
    .catch(err=>{
      winston.error(err);
      res.status(500).send(err.toString())
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
  const isAttachedFile = req.rawBody.length>200;
  const localFile = req.query.file;
  const isLocalFile = localFile != null;
  const version = req.query.version;
  const isExecute = req.query.isExecute === 'true';
  const isDebug = req.query.isDebug === 'true';
  const jwt = req.jwt;
  let executionJwt = req.executionJwt
  
  if(!executionJwt)
    executionJwt = jwt;

  if(!version)
    return res.status(500).send('No version defined!')
  if(!isAttachedFile && !isLocalFile)
    return res.status(500).send('No local file defined AND no file attached!')
  if(isAttachedFile && isLocalFile)
    return res.status(500).send('Local file defined AND file attached!')

  let Importer = null;
  if(isAttachedFile)
    Importer = cdi.importAttachedFile(jwt, attachedFile, version);
  else
    Importer = cdi.importLocalFile(jwt, localFile, version);
  
  Importer
    .then(caseDefinition=>{
      if(isExecute === true)
        return cdi.createAndExecuteCase(executionJwt, isDebug);
      else
        return Promise.resolve(caseDefinition);      
    })
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
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
router.post('/acadela/casedefinition', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const cdi = new CaseDefinitionImporter();
  // const attachedFile = req.rawBody.toString('utf-8');
  // const isAttachedFile = req.rawBody.length>200;
  // const localFile = req.query.file;
  // const isLocalFile = localFile != null;
  const caseTemplate = req.body.jsonTemplate;
  const isCaseTemplate = caseTemplate != null;
  const version = req.query.version;
  const isExecute = req.query.isExecute === 'true';
  const isDebug = req.query.isDebug === 'true';
  const jwt = req.jwt;
  let executionJwt = req.executionJwt

  if(!executionJwt)
    executionJwt = jwt;

  console.log(`jsonTemplate = ${JSON.stringify(caseTemplate)} `)

  if(!version)
    return res.status(500).send('No version defined!')
  if(!isCaseTemplate)
    return res.status(500).send('No json case template defined!')

  let Importer = cdi.import(jwt, caseTemplate, version);

  Importer
      .then(caseDefinition=>{
        if(isExecute === true)
          return cdi.createAndExecuteCase(executionJwt, isDebug);
        else
          return Promise.resolve(caseDefinition);
      })
      .then(result=>{
        res.status(200).send(result);
      })
      .catch(err=>{
        console.log("error: " + err.toString())
        res.status(500).send(err)
      });

});

module.exports = router;
