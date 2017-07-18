import express from 'express';
import TaskParamDefinition from './../../models/casedefinition/model.taskparamdefinition'
const router = express.Router();

/**
 * @api {get} /taskparamdefinitions/:id Get TaskParamDefinition
 * @apiName GetTaskParamDefinition
 * @apiGroup TaskParamDefinitions
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiSampleRequest /taskparamdefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *    id: "b9a51pgpkgbi"
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 */
router.get('/:id', (req, res, next)=>{
  TaskParamDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /taskparamdefinitions Create TaskParamDefinition
 * @apiName PostTaskParamDefinition
 * @apiGroup TaskParamDefinitions
 * @apiParam {String} path Path of the TaskParamDefinition
 * @apiParam {String} isReadOnly Flag if TaskParam is read only
 * @apiParam {String} taskDefinition ID of the TaskDefinition
 * @apiSampleRequest /taskparamdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   {
 *    id: "b9a51pgpkgbi"
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 */
router.post('/', (req, res, next)=>{
  TaskParamDefinition.create(req.jwt, req.body)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /taskparamdefinitions/:id Update TaskParamDefinition
 * @apiName UpdateTaskParamDefinition
 * @apiGroup TaskParamDefinitions
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiParam {String} path Path of the TaskParamDefinition
 * @apiParam {String} isReadOnly Flag if TaskParam is read only
 * @apiParam {String} taskDefinition ID of the TaskDefinition
 * @apiSampleRequest /taskparamdefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *    id: "b9a51pgpkgbi"
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 */
router.patch('/:id', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  TaskParamDefinition.updateById(req.jwt, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /sentrydefinitions/:id Delete TaskParamDefinition
 * @apiName DeleteTaskParamDefinition
 * @apiGroup TaskParamDefinitions
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiSampleRequest /sentrydefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  TaskParamDefinition.deleteById(req.jwt, req.params.id)
    .then(()=>{
      res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
