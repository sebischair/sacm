import express from 'express';
import XMLImporter from './../importer/xmlimporter';
import WorkspaceImporter from './../importer/WorkspaceImporter';
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
  const xml = new XMLImporter();
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
 * @apiParam {boolean} execute (optional) Executes the imported case if an executed is specified within the xml file, false by default
 * @apiParam {string} file (optional) Importes the defined file, by default imports the democase.xml
 * @apiSuccessExample {json} Success-Response:
 * see case/:id/tree route 
 */
router.post('/workspaces', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  const wi = new WorkspaceImporter();
  let file = 'democase.xml';
  if(req.body.file)
    file = req.body.file;
    
  wi.import(req.jwt, file)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});

module.exports = router;
