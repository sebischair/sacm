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
 * @apiGroup Stages
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
 *     "resourceType": "stages"
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
 * @apiGroup Stages
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
 *     "resourceType": "stages"
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
 * @api {post} /stages/:id/activate Activate Stage
 * @apiName ActivateStage
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/activate
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/activate', (req, res, next)=>{
  Stage.activate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /stages/:id/complete Complete Stage
 * @apiName CompleteStage
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/complete
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
 * @api {post} /stages/:id/terminate Terminate Stage
 * @apiName TerminateStage
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/terminate
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
 * @api {get} /stages/:id/processes Get Processes by Stage
 * @apiName GetDirectChildProcesses
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/processes
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
 * @api {get} /stages/:id/tasks Get Tasks by Stage
 * @apiName GetTasks
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/tasks
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
 *          "resourceType": "automatedtasks"
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
 * @api {get} /stages/:id/automatedtasks Get AutomatedTasks by Stage
 * @apiName GetAutomatedTasks
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/automatedtasks
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
 *          "resourceType": "automatedtasks"
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
 * @api {get} /stages/:id/humantasks Get HumanTasks by Stage
 * @apiName GetHumanTasks
 * @apiGroup Stages
 * @apiParam {String} id ID of the Stage
 * @apiSampleRequest /stages/:id/humantasks
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
 *          "resourceType": "humantasks"
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

/**
 * @api {post} /stages/:id/owner/:userid Set Stage Owner
 * @apiName SetOwnerStage
 * @apiGroup Stages
 * @apiParam {String} id ID of a Stage
 * @apiParam {String} userId of the Owner
 * @apiSampleRequest /stages/:id/owner/userid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/owner/:userid', (req, res, next)=>{
  Stage.setOwner(req.jwt, req.params.id, req.params.userid)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /stages/:id/externalid/:externalid Set Stage ExternalId
 * @apiName SetExternalIdStage
 * @apiGroup Stages
 * @apiParam {String} id ID of a Stage
 * @apiParam {String} externalId
 * @apiSampleRequest /stages/:id/externalid/:externalid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/externalid', setExternalId);
router.post('/:id/externalid/:externalid', setExternalId);

function setExternalId(req, res){
    Stage.setExternalId(req.jwt, req.params.id, req.params.externalid, req.body)
        .then(c=>{
            res.status(200).send(c);
        })
        .catch(err=>{
            res.status(500).send(err);
        });
};


module.exports = router;
