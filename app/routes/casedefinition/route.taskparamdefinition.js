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
 *   {
 *     TODO
 *   }
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
