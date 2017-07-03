import express from 'express';
import Case from './../../models/case/model.case';
import Process from './../../models/case/model.process';
import Stage from './../../models/case/model.stage';
import Task from './../../models/case/model.task';
import HumanTask from './../../models/case/model.humantask';
import AutomatedTask from './../../models/case/model.automatedtask';
import Message from './../../models/case/model.message';
import Alert from './../../models/case/model.alert';
import SummarySection from './../../models/case/model.summarysection';
const router = express.Router();


/**
 * @api {get} /cases/me Get My Cases
 * @apiName GetMyCases
 * @apiGroup Case
 * @apiSampleRequest /cases/me
 * @apiSuccessExample {json} Success-Response:
 * [
 *   {
 *     "id": "1rjfflxbki5ly",
 *     "patient": {
 *       "id": "13lvm4qq0uuj9",
 *       "age": 2,
 *       "lastname": "Adams",
 *       "firstname": "Vincent"
 *     },
 *     "stateDates": {
 *       "enabled": "2017-06-09 00:15:42.0",
 *       "terminated": null,
 *       "active": "2017-06-09 00:15:43.0",
 *       "available": "2017-06-09 00:15:42.0",
 *       "completed": null
 *     },
 *     "caseDefinition": "cld9o8hq7prj",
 *     "workspace": "1x79mt8fuzql2",
 *     "description": "Demo Case London",
 *     "entity": "kubc2ty84256",
 *     "name": "Democase",
 *     "state": "ENABLED",
 *     "owner": {
 *       "id": "13lvm4qq0uuj9",
 *       "name": "VincentAdams"
 *     },
 *     "activeProcesses": [
 *       {
 *         "id": "1iaoews1hiey5",
 *         "index": 0,
 *         "description": "Lace",
 *         "name": "Lace",
 *         "resourceType": "HumanTask"
 *       },
 *       {
 *         "id": "avuj6il28ww9",
 *         "index": 0,
 *         "description": "Case Identification",
 *         "name": "CaseIdentification",
 *         "resourceType": "Stage"
 *       }
 *     ],
 *     "resourceType": "Case"
 *   }
 * ]
 */
router.get('/me', (req, res, next)=>{
  Case.findByMe(req.jwt)
    .then(cases=>{
        res.status(200).send(cases);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id Get Case
 * @apiName GetCase
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id
 * @apiSuccessExample {json} Success-Response:
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
 */
router.get('/:id', (req, res, next)=>{
  Case.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /cases Create Case
 * @apiName CreateCase
 * @apiGroup Case
 * @apiParam {String} caseDefinition (mandatory) ID of the CaseDefinition
 * @apiSampleRequest /cases
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "id": "1jvknzqmjcb1a",
 *   "stateDates": {
 *     "enabled": "2017-06-03 08:06:49.0",
 *     "terminated": null,
 *     "active": "2017-06-03 08:06:50.0",
 *     "available": "2017-06-03 08:06:49.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "14w7jmvu13oab",
 *   "workspace": "1isews6ivs0fo",
 *   "description": "Demo Case London",
 *   "entity": "wm5q4wwo8qi",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "resourceType": "Case"
 * }
 */
 router.post('/', (req, res, next)=>{
   Case.create(req.jwt, req.body)
     .then(c=>{
         res.status(200).send(c);
     })
     .catch(err=>{
       res.status(500).send(err);
     })
 });



/**
 * @api {get} /case/:id/tree Get Case Tree
 * @apiName GetCaseTree
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "id": "gyinxwpstldx",
 *   "caseDefinition": "1hruqqxi168fx",
 *   "stateDates": {
 *     "enabled": "2017-06-03 07:46:48.0",
 *     "terminated": null,
 *     "active": "2017-06-03 07:46:49.0",
 *     "available": "2017-06-03 07:46:48.0",
 *     "completed": null
 *   },
 *   "workspace": "1utek7hhrmn6m",
 *   "description": "Demo Case London",
 *   "entity": "1xmjh6un4893x",
 *   "name": "Democase",
 *   "owner": null,
 *   "state": "ENABLED",
 *   "children": [
 *     [
 *       {
 *         "parentStage": null,
 *         "index": 0,
 *         "stateDates": {
 *           "enabled": "2017-06-03 07:46:48.0",
 *           "terminated": null,
 *           "active": "2017-06-03 07:46:48.0",
 *           "available": "2017-06-03 07:46:48.0",
 *           "completed": null
 *         },
 *         "isRepeatable": false,
 *         "next": null,
 *         "state": "ACTIVE",
 *         "children": [
 *           [
 *             {
 *               "parentStage": "e651dpvclqqe",
 *               "index": 0,
 *               "stateDates": {
 *                 "enabled": "2017-06-03 07:46:48.0",
 *                 "terminated": null,
 *                 "active": "2017-06-03 07:46:48.0",
 *                 "available": "2017-06-03 07:46:48.0",
 *                 "completed": null
 *               },
 *               "isRepeatable": false,
 *               "next": null,
 *               "state": "ACTIVE",
 *               "resourceType": "HumanTask",
 *               "prev": null,
 *               "scheduledDate": null,
 *               "id": "eyosp2e9iy3p",
 *               "processDefinition": "18p8wod13gl53",
 *               "possibleActions": [
 *                 "DRAFT",
 *                 "COMPLETE",
 *                 "TERMINATE"
 *               ],
 *               "isManualActivation": false,
 *               "taskParams": [
 *                 "xujpoezfyui7",
 *                 "utvzdwmkcz9"
 *               ],
 *               "description": "Lace",
 *               "name": "Lace",
 *               "isMandatory": true,
 *               "owner": null,
 *               "case": "gyinxwpstldx"
 *             }
 *           ]
 *         ],
 *         "resourceType": "Stage",
 *         "prev": null,
 *         "id": "e651dpvclqqe",
 *         "processDefinition": "1piaj7aobvjca",
 *         "possibleActions": [],
 *         "isManualActivation": false,
 *         "description": "Case Identification",
 *         "name": "CaseIdentification",
 *         "isMandatory": true,
 *         "case": "gyinxwpstldx"
 *       }
 *     ],
 *     [
 *       {
 *         "parentStage": null,
 *         "index": 0,
 *         "stateDates": {
 *           "enabled": null,
 *           "terminated": null,
 *           "active": null,
 *           "available": "2017-06-03 07:46:48.0",
 *           "completed": null
 *         },
 *         "isRepeatable": true,
 *         "next": null,
 *         "state": "AVAILABLE",
 *         "children": [
 *           [
 *             {
 *               "parentStage": "172l9hvvuax3i",
 *               "index": 0,
 *               "stateDates": {
 *                 "enabled": null,
 *                 "terminated": null,
 *                 "active": null,
 *                 "available": "2017-06-03 07:46:48.0",
 *                 "completed": null
 *               },
 *               "isRepeatable": false,
 *               "next": null,
 *               "state": "AVAILABLE",
 *               "resourceType": "HumanTask",
 *               "prev": null,
 *               "scheduledDate": null,
 *               "id": "nwrfwpyvqsww",
 *               "processDefinition": "pyo0qgrbjw9v",
 *               "possibleActions": [],
 *               "isManualActivation": false,
 *               "taskParams": [
 *                 "vfk5qlag24dp",
 *                 "15nisfz3fesej"
 *               ],
 *               "description": "Barthel",
 *               "name": "Barthel",
 *               "isMandatory": true,
 *               "owner": null,
 *               "case": "gyinxwpstldx"
 *             }
 *           ]
 *         ],
 *         "resourceType": "Stage",
 *         "prev": null,
 *         "id": "172l9hvvuax3i",
 *         "processDefinition": "jycsfe58lqh5",
 *         "possibleActions": [],
 *         "isManualActivation": false,
 *         "description": "Case Evaluation",
 *         "name": "CaseEvaluation",
 *         "isMandatory": false,
 *         "case": "gyinxwpstldx"
 *       }
 *     ],
 *     [
 *       {
 *         "parentStage": null,
 *         "index": 0,
 *         "stateDates": {
 *           "enabled": null,
 *           "terminated": null,
 *           "active": null,
 *           "available": "2017-06-03 07:46:48.0",
 *           "completed": null
 *         },
 *         "isRepeatable": true,
 *         "next": null,
 *         "state": "AVAILABLE",
 *         "children": [
 *           [
 *             {
 *               "parentStage": "hsf1x1ee6694",
 *               "index": 0,
 *               "stateDates": {
 *                 "enabled": null,
 *                 "terminated": null,
 *                 "active": null,
 *                 "available": "2017-06-03 07:46:48.0",
 *                 "completed": null
 *               },
 *               "isRepeatable": false,
 *               "next": null,
 *               "state": "AVAILABLE",
 *               "resourceType": "HumanTask",
 *               "prev": null,
 *               "scheduledDate": null,
 *               "id": "19uh25szoh0em",
 *               "processDefinition": "1dqsr8w6ja9aa",
 *               "possibleActions": [],
 *               "isManualActivation": false,
 *               "taskParams": [
 *                 "14mdj7mjqc8kw",
 *                 "f23jzewf8sxk"
 *               ],
 *               "description": "Physical Activity Prescription",
 *               "name": "PhysicalActivityPrescription",
 *               "isMandatory": true,
 *               "owner": null,
 *               "case": "gyinxwpstldx"
 *             }
 *           ]
 *         ],
 *         "resourceType": "Stage",
 *         "prev": null,
 *         "id": "hsf1x1ee6694",
 *         "processDefinition": "t1honuj1kynx",
 *         "possibleActions": [],
 *         "isManualActivation": false,
 *         "description": "Workplan Definition",
 *         "name": "WorkplanDefinition",
 *         "isMandatory": false,
 *         "case": "gyinxwpstldx"
 *       }
 *     ],
 *     [
 *       {
 *         "parentStage": null,
 *         "index": 0,
 *         "stateDates": {
 *           "enabled": "2017-06-03 07:46:48.0",
 *           "terminated": null,
 *           "active": "2017-06-03 07:46:48.0",
 *           "available": "2017-06-03 07:46:48.0",
 *           "completed": null
 *         },
 *         "isRepeatable": false,
 *         "next": null,
 *         "state": "ACTIVE",
 *         "children": [
 *           [
 *             {
 *               "parentStage": "14dp1cho8q3f8",
 *               "index": 0,
 *               "stateDates": {
 *                 "enabled": "2017-06-03 07:46:48.0",
 *                 "terminated": null,
 *                 "active": "2017-06-03 07:46:48.0",
 *                 "available": "2017-06-03 07:46:48.0",
 *                 "completed": null
 *               },
 *               "isRepeatable": false,
 *               "next": null,
 *               "state": "ACTIVE",
 *               "resourceType": "HumanTask",
 *               "prev": null,
 *               "scheduledDate": null,
 *               "id": "sx4dh9g25zbg",
 *               "processDefinition": "dstpzuyf03e8",
 *               "possibleActions": [
 *                 "DRAFT",
 *                 "COMPLETE",
 *                 "TERMINATE"
 *               ],
 *               "isManualActivation": false,
 *               "taskParams": [
 *                 "1ud5sca96la9f",
 *                 "1tya4v3irojfk"
 *               ],
 *               "description": "Dischargefrom",
 *               "name": "DischageForm",
 *               "isMandatory": true,
 *               "owner": null,
 *               "case": "gyinxwpstldx"
 *             }
 *           ]
 *         ],
 *         "resourceType": "Stage",
 *         "prev": null,
 *         "id": "14dp1cho8q3f8",
 *         "processDefinition": "1q16esle6fplj",
 *         "possibleActions": [],
 *         "isManualActivation": false,
 *         "description": "Discharge",
 *         "name": "Discharge",
 *         "isMandatory": true,
 *         "case": "gyinxwpstldx"
 *       }
 *     ]
 *   ],
 *   "resourceType": "Case"
 * }
 */
router.get('/:id/tree', (req, res, next)=>{
  Case.findTreeById(req.jwt, req.params.id, {})
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});



/**
 * @api {post} /case/:id/complete Complete Case
 * @apiName CompleteCase
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/complete
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/complete', (req, res, next)=>{
  Case.complete(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /case/:id/terminate Terminate Case
 * @apiName TerminateCase
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/terminate
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/terminate', (req, res, next)=>{
  Case.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {delete} /case/:id Delete Case
 * @apiName DeleteCase
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id
 * @apiSuccessExample {json} Success-Response:
 *   {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  Case.deleteById(req.jwt, req.params.id)
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
 * @apiName GetDirectChildProcesses
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/processes
 * @apiSuccessExample {json} Success-Response:
 *      // An array of process objects, see model
 *      [{
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
router.get('/:id/processes', (req, res, next)=>{
  Process.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/processes/all Get All Processes
 * @apiName GetAllProcesses
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/processes/all
 * @apiSuccessExample {json} Success-Response:
 *      // An array of process objects, see model
 *      [{
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
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }]
 */
router.get('/:id/processes/all', (req, res, next)=>{
  Process.findByCaseId(req.jwt, req.params.id)
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
 * @apiName GetDirectChildStages
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/stages
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *       "processDefinition": "1104j66pit6iz",
 *       "id": "opifq3c2u1vn",
 *       "parentStage": null,
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
 */
router.get('/:id/stages', (req, res, next)=>{
  Stage.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/stages/all Get All Stages
 * @apiName GetStages
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/stages/all
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *       "processDefinition": "1104j66pit6iz",
 *       "id": "opifq3c2u1vn",
 *       "parentStage": null,
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
 */
router.get('/:id/stages/all', (req, res, next)=>{
  Stage.findALLbyCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// tasks

/**
 * @api {get} /case/:id/tasks Get Direkt Child Tasks
 * @apiName GetTasks
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/tasks
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
 * @api {get} /case/:id/tasks/all Get All Tasks
 * @apiName GetAllTasks
 * @apiGroup Case
 * @apiParam {String} id (mandatory) ID of the Case
 * @apiSampleRequest /case/:id/tasks/all
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
router.get('/:id/tasks/all', (req, res, next)=>{
  Task.findALLbyCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/humantasks Get Child HumanTasks
 * @apiName GetHumanTasks
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/humantasks
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
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "HumanTask"
 *     }]
 */
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/humantasks/all Get All HumanTasks
 * @apiName GetAllHumanTasks
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/humantasks/all
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
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "HumanTask"
 *     }]
 */
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findALLbyCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/automatedtasks Get ChildAutomatedTasks
 * @apiName GetAutomatedTasks
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/automatedtasks
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
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }]
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/automatedtasks/all Get All AutomatedTasks
 * @apiName GetAllAutomatedTasks
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/tasks/all
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
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }]
 */
router.get('/:id/automatedtasks/all', (req, res, next)=>{
  AutomatedTask.findALLbyCaseId(req.jwt, req.params.id)
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
 * @apiName GetMessages
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/messages
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     TODO MESSAGE_OBJ
 *   }
 */
router.get('/:id/messages', (req, res, next)=>{
  Message.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// alerts

/**
 * @api {get} /case/:id/alerts Get Alerts by Case
 * @apiName GetAlerts
 * @apiGroup Alert
 * @apiParam {String} id ID of the Case 
 * @apiSampleRequest /case/:id/alerts
 * @apiSuccessExample {json} Success-Response:
 *  [{
 *  	"id": "jdddqzyu6ser7",
 *  	"process": "1rjdqzyu6ser9",
 *  	"creationDate": "2017-06-12 13:58:56.0",
 *  	"expireDate": "2017-06-14 13:52:12.0",
 *  	"text": "Alert Message",
 *  	"data": {
 *  		"alertType": "some type",
 *  		"application": "Run App",
 *  		"priorityLevel": "LOW",
 *  		"status": "ACT",
 *  		"paramName": "steps per day",
 *  		"paramValue": "12",
 *  		"minThreshold": "5",
 *  		"maxThreshold": "8"
 *  	}
 *  	"seenDate": null
 *  }]
 */
router.get('/:id/alerts', (req, res, next)=>{
  Alert.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// SummarySection

/**
 * @api {get} /case/:id/summarysections Get Summary 
 * @apiName GetSummary
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/summarysections
 * @apiSuccessExample {json} Success-Response:
 * [
 *   {
 *     "description": "Section 1",
 *     "summarysectiondefinition": "wharh67xkeki",
 *     "name": "Section1",
 *     "params": [
 *       {
 *         "attributeTypeConstraints": {
 *           "enumerationOptions": [
 *             {
 *               "description": "1 day",
 *               "value": "1"
 *             },
 *             {
 *               "description": "2 days",
 *               "value": "2"
 *             }
 *           ]
 *         },
 *         "values": [
 *           "2"
 *         ],
 *         "isDerived": false,
 *         "defaultValues": [],
 *         "description": "Length of Stay (including day of admission and discharge)",
 *         "name": "lace1",
 *         "attributeType": "enumeration",
 *         "multiplicity": "maximalOne",
 *         "isResolved": true
 *       }
 *     ],
 *     "case": "1xte2pe0m1b9m",
 *     "resourceType": "SummarySection"
 *   },
 *   {
 *     "description": "Section 2",
 *     "summarysectiondefinition": "1kjigrxkwummk",
 *     "name": "Section2",
 *     "params": [
 *       {
 *         "attributeTypeConstraints": {
 *           "enumerationOptions": [
 *             {
 *               "description": "1 day",
 *               "value": "1"
 *             },
 *             {
 *               "description": "2 days",
 *               "value": "2"
 *             }
 *           ]
 *         },
 *         "values": [
 *           "2"
 *         ],
 *         "isDerived": false,
 *         "defaultValues": [],
 *         "description": "Length of Stay (including day of admission and discharge)",
 *         "name": "lace1",
 *         "attributeType": "enumeration",
 *         "multiplicity": "maximalOne",
 *         "isResolved": true
 *       },
 *       {
 *         "attributeTypeConstraints": {
 *           "enumerationOptions": [
 *             {
 *               "description": "No",
 *               "value": "0"
 *             },
 *             {
 *               "description": "Yes",
 *               "value": "1"
 *             }
 *           ]
 *         },
 *         "values": [
 *           "0"
 *         ],
 *         "isDerived": false,
 *         "defaultValues": [],
 *         "description": "Was the patient admitted to hospital via the emergency department?",
 *         "name": "lace2",
 *         "attributeType": "enumeration",
 *         "multiplicity": "maximalOne",
 *         "isResolved": true
 *       }
 *     ],
 *     "case": "1xte2pe0m1b9m",
 *     "resourceType": "SummarySection"
 *   }
 * ]
 */
router.get('/:id/summarysections', (req, res, next)=>{
  SummarySection.findByCaseId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/permissions Case Permissions
 * @apiName CasePermission
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiSampleRequest /case/:id/permissions
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "inheritedReaders": [],
 *     "writers": [],
 *     "readers": [
 *         {
 *             "id": "2c9480845bee03e7015bfcad28990010",
 *             "name": "connecare-clinician"
 *         }
 *     ],
 *     "inheritedWriters": [
 *         {
 *             "id": "wb9ikuclqmx6",
 *             "name": "Max Mustermann"
 *         }
 *     ]
 * }
 */
router.get('/:id/permissions', (req, res, next)=>{
  Case.permissions(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /case/:id/reader Add a reader to the case
 * @apiName CaseReader
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiParam {String} id ID of the Principal
 * @apiSampleRequest /case/:id/reader
 * @apiSuccessExample {json} Success-Response:
 */
router.post('/:id/reader/:principalId', (req, res, next)=>{
  Case.addReader(req.jwt, req.params.id, req.params.principalId)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /case/:id/reader Add a reader to the case
 * @apiName CaseReader
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiParam {String} id ID of the Principal
 * @apiSampleRequest /case/:id/reader
 * @apiSuccessExample {json} Success-Response:
 */
router.delete('/:id/reader/:principalId', (req, res, next)=>{
  Case.removeReader(req.jwt, req.params.id, req.params.principalId)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /case/:id/writer Add a writer to the case
 * @apiName CaseWriter
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiParam {String} id ID of the Principal
 * @apiSampleRequest /case/:id/writer
 * @apiSuccessExample {json} Success-Response:
 */
router.post('/:id/writer/:principalId', (req, res, next)=>{
  Case.addWriter(req.jwt, req.params.id, req.params.principalId)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /case/:id/writer Add a writer to the case
 * @apiName CaseWriter
 * @apiGroup Case
 * @apiParam {String} id ID of the Case
 * @apiParam {String} id ID of the Principal
 * @apiSampleRequest /case/:id/writer
 * @apiSuccessExample {json} Success-Response:
 */
router.delete('/:id/writer/:principalId', (req, res, next)=>{
  Case.removeWriter(req.jwt, req.params.id, req.params.principalId)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /cases Get All Case tha can be access with the current user
 * @apiName GetCases
 * @apiGroup Case
 * @apiSampleRequest /cases
 * @apiSuccessExample {json} Success-Response:
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
 */
router.get('/', (req, res, next)=>{
  Case.findAll(req.jwt)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});





module.exports = router;
