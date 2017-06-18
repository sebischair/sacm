import express from 'express';
var router = express.Router();
import TaskParamDefinition from './../../models/casedefinition/model.taskparamdefinition'


/**
 * @api {get} /taskparamdefinition/:id Get TaskParamDefinition
 * @apiName GetTaskParamDefinition
 * @apiGroup TaskParamDefinition
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiSampleRequest /taskparamdefinition/:id
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
 * @apiGroup TaskParamDefinition
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
  var data = {
    on: req.body.on,
    isReadOnly: req.body.isReadOnly,
    taskDefinition: req.body.taskDefinition,
  }
  TaskParamDefinition.create(req.jwt, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /taskparamdefinition/:id Update TaskParamDefinition
 * @apiName UpdateTaskParamDefinition
 * @apiGroup TaskParamDefinition
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiParam {String} path Path of the TaskParamDefinition
 * @apiParam {String} isReadOnly Flag if TaskParam is read only
 * @apiParam {String} taskDefinition ID of the TaskDefinition
 * @apiSampleRequest /taskparamdefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *    id: "b9a51pgpkgbi"
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    on: req.body.on,
    isReadOnly: req.body.isReadOnly,
    taskDefinition: req.body.taskDefinition,
  }
  TaskParamDefinition.updateById(req.jwt, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /sentrydefinition/:id Delete TaskParamDefinition
 * @apiName DeleteTaskParamDefinition
 * @apiGroup TaskParamDefinition
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiSampleRequest /sentrydefinition/:id
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
