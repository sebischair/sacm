import express from 'express';

var router = express.Router();
import Stage from './../../models/case/model.stage';
import Process from './../../models/case/model.process';
import Task from './../../models/case/model.task';
import HumanTask from './../../models/case/model.humantask';
import AutomatedTask from './../../models/case/model.automatedtask';




/**
 * @api {get} /stage/:id Get Stage
 *
 * @apiName GetStage
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO STAGE_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Stage.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /stage/:id/stages Get Sub Stages
 *
 * @apiName GetSubStages
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/stages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO STAGE_OBJ
 *   }
 *
 */
router.get('/:id/stages', (req, res, next)=>{
  Stage.findbyStageId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /stage/:id/complete Complete Stage
 *
 * @apiName CompleteStage
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/complete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.post('/:id/complete', (req, res, next)=>{
  Stage.complete(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /stage/:id/terminate Terminate Stage
 *
 * @apiName TerminateStage
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/terminate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.post('/:id/terminate', (req, res, next)=>{
  Stage.terminate(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



// processes

/**
 * @api {get} /stage/:id/processes Get Processes
 *
 * @apiName GetDirectChildProcesses
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/processes
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id/processes', (req, res, next)=>{
  Process.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// tasks

/**
 * @api {get} /stage/:id/tasks Get Tasks
 *
 * @apiName GetTasks
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/tasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_OBJ
 *   }
 *
 */
router.get('/:id/tasks', (req, res, next)=>{
  Task.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /stage/:id/automatedtasks Get AutomatedTasks
 *
 * @apiName GetAutomatedTasks
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/automatedtasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO AUTOMATED_TASK_OBJ
 *   }
 *
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findbyStageId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /stage/:id/humantasks Get HumanTasks
 *
 * @apiName GetHumanTasks
 * @apiGroup Stage
 *
 * @apiParam {String} id ID of the Stage
 *
 * @apiSampleRequest /stage/:id/humantasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO AUTOMATED_TASK_OBJ
 *   }
 *
 */
router.get('/:id/humantasks', (req, res, next)=>{
   HumanTask.findbyStageId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
