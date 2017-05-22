import express from 'express';

var router = express.Router();
import Case from './../../models/case/model.case';
import Process from './../../models/case/model.process';
import Stage from './../../models/case/model.stage';
import Task from './../../models/case/model.task';
import HumanTask from './../../models/case/model.humantask';
import AutomatedTask from './../../models/case/model.automatedtask';
import Message from './../../models/case/model.message';
import Alert from './../../models/case/model.alert';
import Summary from './../../models/case/model.summary';


// my cases

/**
 * @api {get} /cases/me Get my cases
 *
 * @apiName GetMyCases
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /cases/me
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO SUMMARY_OBJ
 *   }
 *
 */
router.get('/me', (req, res, next)=>{
  Case.findByMe()
    .then(cases=>{
        res.status(200).send(cases);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id Get Case
 *
 * @apiName GetCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "id": "1q7nud4e2v1dl",
 *   "stateDates": {
 *     "enabled": "2017-05-15 17:29:14.0",
 *     "terminated": null,
 *     "active": null,
 *     "available": "2017-05-15 17:29:14.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "1xzmymv4hf0tj",
 *   "workspace": "1mwgok4jx7397",
 *   "description": "Demo Case London",
 *   "entity": "vcqm404srunk",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "resourceType": "Case"
 * }
 *
 */
router.get('/:id', (req, res, next)=>{
  Case.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /cases Create Case
 *
 * @apiName CreateCase
 * @apiGroup Case
 *
 * @apiParam {String} caseDefinition ID of the CaseDefinition
 *
 * @apiSampleRequest /cases
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "id": "1q7nud4e2v1dl",
 *   "stateDates": {
 *     "enabled": "2017-05-15 17:29:14.0",
 *     "terminated": null,
 *     "active": null,
 *     "available": "2017-05-15 17:29:14.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "1xzmymv4hf0tj",
 *   "workspace": "1mwgok4jx7397",
 *   "description": "Demo Case London",
 *   "entity": "vcqm404srunk",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "resourceType": "Case"
 * }
 *
 */
 router.post('/', (req, res, next)=>{
   var data = {
     caseDefinitionId: req.body.caseDefinitionId
   }
   Case.create(data)
     .then(c=>{
         res.status(200).send(c);
     })
     .catch(err=>{
       res.status(500).send(err);
     })
 });



/**
 * @api {get} /case/:id Get Case Tree
 *
 * @apiName GetCaseTree
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "id": "1q7nud4e2v1dl",
 *   "stateDates": {
 *     "enabled": "2017-05-15 17:29:14.0",
 *     "terminated": null,
 *     "active": null,
 *     "available": "2017-05-15 17:29:14.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "1xzmymv4hf0tj",
 *   "workspace": "1mwgok4jx7397",
 *   "description": "Demo Case London",
 *   "entity": "vcqm404srunk",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "children": [], // Tasks and Stages
 *   "resourceType": "Case"
 * }
 *
 */
router.get('/:id/tree', (req, res, next)=>{
  Case.findTreebyId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /case/:id/complete Complete Case
 *
 * @apiName CompleteCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/complete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.post('/:id/complete', (req, res, next)=>{
  Case.complete(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /case/:id/complete Terminate Case
 *
 * @apiName TerminateCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/terminate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.post('/:id/terminate', (req, res, next)=>{
  Case.terminate(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id Delete Case
 *
 * @apiName DeleteCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  Case.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// processes

/**
 * @api {get} /case/:id/processes Get Child Processes
 *
 * @apiName GetDirectChildProcesses
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/processes
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      // An array of process objects, see model
 *      [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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


/**
 * @api {get} /case/:id/processes/all Get All Processes
 *
 * @apiName GetAllProcesses
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/processes/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      // An array of process objects, see model
 *      [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
 *
 */
router.get('/:id/processes/all', (req, res, next)=>{
  Process.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// stages

/**
 * @api {get} /case/:id/stages Get Child Stages
 *
 * @apiName GetDirectChildStages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/stages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "processDefinition": "1104j66pit6iz",
 *       "id": "opifq3c2u1vn",
 *       "parentStage": null,
 *       "sentries": [],
 *       "stateDates": {
 *         "enabled": "2017-05-15 17:29:18.0",
 *         "terminated": null,
 *         "active": null,
 *         "available": "2017-05-15 17:29:15.0",
 *         "completed": null
 *       },
 *       "description": "Workplan Definition",
 *       "name": "WorkplanDefinition",
 *       "state": "ENABLED",
 *       "children": [],
 *       "case": "1q7nud4e2v1dl",
 *       "resourceType": "Stage"
 *     }]
 *
 */
router.get('/:id/stages', (req, res, next)=>{
  Stage.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/stages/all Get All Stages
 *
 * @apiName GetStages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/stages/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "processDefinition": "1104j66pit6iz",
 *       "id": "opifq3c2u1vn",
 *       "parentStage": null,
 *       "sentries": [],
 *       "stateDates": {
 *         "enabled": "2017-05-15 17:29:18.0",
 *         "terminated": null,
 *         "active": null,
 *         "available": "2017-05-15 17:29:15.0",
 *         "completed": null
 *       },
 *       "description": "Workplan Definition",
 *       "name": "WorkplanDefinition",
 *       "state": "ENABLED",
 *       "children": [],
 *       "case": "1q7nud4e2v1dl",
 *       "resourceType": "Stage"
 *     }]
 *
 */
router.get('/:id/stages/all', (req, res, next)=>{
  Stage.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// tasks

/**
 * @api {get} /case/:id/tasks Get Child Tasks
 *
 * @apiName GetTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
 *
 */
router.get('/:id/tasks/all', (req, res, next)=>{
  Task.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/tasks/all Get All Tasks
 *
 * @apiName GetAllTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
 *
 */
router.get('/:id/tasks/all', (req, res, next)=>{
  Task.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/humantasks Get Child HumanTasks
 *
 * @apiName GetHumanTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/humantasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "scheduledDate": null,
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/humantasks/all Get All HumanTasks
 *
 * @apiName GetAllHumanTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/humantasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "scheduledDate": null,
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/automatedtasks Get ChildAutomatedTasks
 *
 * @apiName GetAutomatedTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/automatedtasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
 *
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/automatedtasks/all Get All AutomatedTasks
 *
 * @apiName GetAllAutomatedTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
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
 *
 */
router.get('/:id/automatedtasks/all', (req, res, next)=>{
  AutomatedTask.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// messages

/**
 * @api {get} /case/:id/messages Get Messages
 *
 * @apiName GetMessages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/messages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO MESSAGE_OBJ
 *   }
 *
 */
router.get('/:id/messages', (req, res, next)=>{
  Message.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// alerts


/**
 * @api {get} /case/:id/alerts Get Alerts
 *
 * @apiName GetAlerts
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/alerts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO ALERT_OBJ
 *   }
 *
 */
router.get('/:id/alerts', (req, res, next)=>{
  Alert.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// summary

/**
 * @api {get} /case/:id/summary Get Summary
 *
 * @apiName GetSummary
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/summary
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO SUMMARY_OBJ
 *   }
 *
 */
router.get('/:id/summary', (req, res, next)=>{
  Summary.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});






module.exports = router;
