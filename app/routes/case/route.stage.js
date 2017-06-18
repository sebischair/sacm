import express from 'express';
import Stage from './../../models/case/model.stage';
import Process from './../../models/case/model.process';
import Task from './../../models/case/model.task';
import HumanTask from './../../models/case/model.humantask';
import AutomatedTask from './../../models/case/model.automatedtask';
const router = express.Router();



/**
 * @api {get} /stage/:id Get Stage
 * @apiName GetStage
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "processDefinition": "1kudcltcejsy3",
 *     "id": "713lc56e3ggb",
 *     "parentStage": null,
 *     "stateDates": {
 *       "enabled": "2017-05-16 12:44:02.0",
 *       "terminated": null,
 *       "active": null,
 *       "available": "2017-05-16 12:44:01.0",
 *       "completed": null
 *     },
 *     "description": "Workplan Definition",
 *     "name": "WorkplanDefinition",
 *     "state": "ENABLED",
 *     "children": [],
 *     "case": "zgc0k7ou8xuk",
 *     "resourceType": "Stage"
 *    }
 *
 */
router.get('/:id', (req, res, next)=>{
  Stage.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /stage/:id/stages Get Sub Stages
 * @apiName GetSubStages
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/stages
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *     "processDefinition": "1kudcltcejsy3",
 *     "id": "713lc56e3ggb",
 *     "parentStage": null,
 *     "stateDates": {
 *       "enabled": "2017-05-16 12:44:02.0",
 *       "terminated": null,
 *       "active": null,
 *       "available": "2017-05-16 12:44:01.0",
 *       "completed": null
 *     },
 *     "description": "Workplan Definition",
 *     "name": "WorkplanDefinition",
 *     "state": "ENABLED",
 *     "children": [],
 *     "case": "zgc0k7ou8xuk",
 *     "resourceType": "Stage"
 *    }]
 */
router.get('/:id/stages', (req, res, next)=>{
  Stage.findByStageId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /stage/:id/complete Complete Stage
 * @apiName CompleteStage
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/complete
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/complete', (req, res, next)=>{
  Stage.complete(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /stage/:id/terminate Terminate Stage
 * @apiName TerminateStage
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/terminate
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/terminate', (req, res, next)=>{
  Stage.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



// processes

/**
 * @api {get} /stage/:id/processes Get Processes by Stage
 * @apiName GetDirectChildProcesses
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/processes
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id/processes', (req, res, next)=>{
  Process.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// tasks

/**
 * @api {get} /stage/:id/tasks Get Tasks by Stage
 * @apiName GetTasks
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/tasks
 * @apiSuccessExample {json} Success-Response:
 *     // List of Automated and/or HumanTasks
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "stateDates": {
 *            "enabled": "2017-05-15 17:29:18.0",
 *            "terminated": null,
 *            "active": null,
 *            "available": "2017-05-15 17:29:17.0",
 *            "completed": null
 *          },
 *          "taskParams": [],
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }]
 */
router.get('/:id/tasks', (req, res, next)=>{
  Task.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /stage/:id/automatedtasks Get AutomatedTasks by Stage
 * @apiName GetAutomatedTasks
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/automatedtasks
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "stateDates": {
 *            "enabled": "2017-05-15 17:29:18.0",
 *            "terminated": null,
 *            "active": null,
 *            "available": "2017-05-15 17:29:17.0",
 *            "completed": null
 *          },
 *          "taskParams": [],
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }]
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findByStageId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /stage/:id/humantasks Get HumanTasks by Stage
 * @apiName GetHumanTasks
 * @apiGroup Stage
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stage/:id/humantasks
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *          "scheduledDate": null,
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "stateDates": {
 *            "enabled": "2017-05-15 17:29:18.0",
 *            "terminated": null,
 *            "active": null,
 *            "available": "2017-05-15 17:29:17.0",
 *            "completed": null
 *          },
 *          "taskParams": [],
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "HumanTask"
 *     }]
 *
 */
router.get('/:id/humantasks', (req, res, next)=>{
   HumanTask.findByStageId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
