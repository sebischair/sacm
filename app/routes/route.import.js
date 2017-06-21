import express from 'express';
import XMLImporter from './../importer/xmlimporter';
import http from './../models/http';
const router = express.Router();

/**
 * @api {post} /import Import
 * @apiName Import
 * @apiGroup Import
 * @apiParam {boolean} execute (optional) Executes the imported case if an executed is specified within the xml file, false by default
 * @apiParam {string} file (optional) Importes the defined file, by default imports the democase.xml
 * @apiSuccessExample {json} Success-Response:
 * see case/:id/tree route 
 */
router.post('/', (req, res, next)=>{
  const xml = new XMLImporter();
  let file = 'democase.xml';
  let isExecuteCase = false;
  let executionJwt = req.jwt;
  if(req.body.file)
    file = req.body.file;
  if(req.body.execute)
    isExecuteCase = true;
  if(req.body.executionuser)
    executionJwt = http.generateJWT(req.body.executionuser, 'ottto');

  xml.import(req.jwt, 'app/importer/'+file, isExecuteCase, executionJwt)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});

module.exports = router;
