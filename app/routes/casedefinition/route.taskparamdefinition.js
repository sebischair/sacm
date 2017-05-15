import express from 'express';
var router = express.Router();
import TaskParamDefinition from './../../models/casedefinition/model.taskparamdefinition'


/**
 * @api {get} /taskparamdefinition/:id Get TaskParamDefinition
 *
 * @apiName GetTaskParamDefinition
 * @apiGroup TaskParamDefinition
 *
 * @apiParam {String} id ID of the TaskParamDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_PARAM_DEF_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  TaskParamDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /taskparamdefinition Create TaskParamDefinition
 *
 * @apiName PostTaskParamDefinition
 * @apiGroup TaskParamDefinition
 *
 * @apiParam {String} path Path of the TaskParamDefinition
 * @apiParam {String} isReadOnly Flag if TaskParamDefinition is read only
 * @apiParam {String} taskDefinition ID of the parent TaskDefinition
 *
 * @apiSampleRequest /taskparamdefinition
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 *
 */
router.post('/', (req, res, next)=>{
  var data = {
    on: req.body.on,
    isReadOnly: req.body.isReadOnly,
    taskDefinition: req.body.taskDefinition,
  }
  TaskParamDefinition.create(data)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /taskparamdefinition/:id Update TaskParamDefinition
 *
 * @apiName UpdateTaskParamDefinition
 * @apiGroup TaskParamDefinition
 *
 * @apiParam {String} id ID of the TaskParamDefinition
 * @apiParam {String} path Path of the TaskParamDefinition
 * @apiParam {String} isReadOnly Flag if TaskParamDefinition is read only
 * @apiParam {String} taskDefinition ID of the parent TaskDefinition
 *
 * @apiSampleRequest /taskparamdefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }
 *
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    on: req.body.on,
    isReadOnly: req.body.isReadOnly,
    taskDefinition: req.body.taskDefinition,
  }
  TaskParamDefinition.updateById(data)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /sentrydefinition/:id Delete TaskParamDefinition
 *
 * @apiName DeleteTaskParamDefinition
 * @apiGroup TaskParamDefinition
 *
 * @apiParam {String} id ID of the TaskParamDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  TaskParamDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
