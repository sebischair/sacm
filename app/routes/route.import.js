import express from 'express';
var router = express.Router();
import XMLImporter from './../importer/xmlimporter';


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
  if(req.body.file)
    file = req.body.file;
  if(req.body.execute)
    isExecuteCase = true;
  xml.import(req.jwt, 'app/importer/'+file, isExecuteCase)
    .then(case1=>{
      res.status(200).send(case1);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err)
    });
});

module.exports = router;
