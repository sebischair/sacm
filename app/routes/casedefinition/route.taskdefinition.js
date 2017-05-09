import express from 'express';

var router = express.Router();

// Models
// import TaskDefinition from './../../models/casedefinition/model.taskdefinition';
import Task from './../../models/case/model.task';

/**
 * @api {get} /taskdefinition/:id/taskparamdefinitions Get all TaskParamDefinitions for the given TaskDefinition
 *
 * @apiName GetTaskParamDefinitionByTaskDefinitionID
 * @apiGroup TaskDefinition
 *
 * @apiParam {String} id ID of the TaskDefinition
 *
 * @apiSampleRequest /taskdefinition/:id/taskparamdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_DEF_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  TaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /taskdefinition/:id/tasks Get all Tasks for the given TaskDefinition
 *
 * @apiName GetTasksByTaskDefinitionID
 * @apiGroup TaskDefinition
 *
 * @apiParam {String} id ID of the TaskDefinition
 *
 * @apiSampleRequest /taskdefinition/:id/tasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_OBJ
 *   }
 *
 */
router.get('/:id/tasks', (req, res, next)=>{
  Task.findByTaskDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
