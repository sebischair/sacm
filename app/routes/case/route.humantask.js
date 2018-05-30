import express from 'express';
import HumanTask from './../../models/case/model.humantask';
const router = express.Router();


/**
 * @api {get} humantasks/me/active Get My HumanTask that are active 
 * @apiName GetHumanTask
 * @apiGroup HumanTasks
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "parentStage": "1x26mpxg3dabq",
 *   "index": 0,
 *   "stateDates": {
 *     "enabled": "2017-06-07 00:22:16.0",
 *     "terminated": null,
 *     "active": "2017-06-07 00:22:16.0",
 *     "available": "2017-06-07 00:22:16.0",
 *     "completed": null
 *   },
 *   "isRepeatable": false,
 *   "next": null,
 *   "state": "ACTIVE",
 *   "resourceType": "humantasks",
 *   "prev": null,
 *   "scheduledDate": null,
 *   "id": "9411d2nyotg3",
 *   "processDefinition": "6pg40n08k5yc",
 *   "possibleActions": [],
 *   "isManualActivation": false,
 *   "description": "Lace",
 *   "name": "Lace",
 *   "isMandatory": true,
 *   "owner": null,
 *   "case": "1rx44jafa5psr"
 * }
 */
router.get('/me/active', (req, res, next)=>{
  HumanTask.findMeActive(req.jwt)
    .then(hts=>{
        res.status(200).send(hts);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} humantasks/:id Get HumanTask
 * @apiName GetHumanDefinition
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "parentStage": "1x26mpxg3dabq",
 *   "index": 0,
 *   "stateDates": {
 *     "enabled": "2017-06-07 00:22:16.0",
 *     "terminated": null,
 *     "active": "2017-06-07 00:22:16.0",
 *     "available": "2017-06-07 00:22:16.0",
 *     "completed": "2017-06-07 00:22:18.0"
 *   },
 *   "isRepeatable": false,
 *   "next": null,
 *   "state": "COMPLETED",
 *   "resourceType": "humantasks",
 *   "prev": null,
 *   "scheduledDate": null,
 *   "id": "9411d2nyotg3",
 *   "processDefinition": "6pg40n08k5yc",
 *   "possibleActions": [],
 *   "isManualActivation": false,
 *   "taskParams": [
 *     {
 *       "id": "w8xkoqye52ln",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "1 day",
 *             "value": "1"
 *           },
 *           {
 *             "description": "2 days",
 *             "value": "2"
 *           }
 *         ]
 *       },
 *       "values": [
 *         "2"
 *       ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Length of Stay (including day of admission and discharge)",
 *       "isMandatory": false,
 *       "name": "lace1",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     },
 *     {
 *       "id": "8p599v61r2em",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "No",
 *             "value": "0"
 *           },
 *           {
 *             "description": "Yes",
 *             "value": "1"
 *           }
 *         ]
 *       },
 *       "values": [
 *         "0"
 *       ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Was the patient admitted to hospital via the emergency department?",
 *       "isMandatory": false,
 *       "name": "lace2",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     }
 *   ],
 *   "description": "Lace",
 *   "name": "Lace",
 *   "isMandatory": true,
 *   "owner": null,
 *   "case": "1rx44jafa5psr"
 * }
 */
router.get('/:id', (req, res, next)=>{
  HumanTask.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} humantasks/:id/activate Activate HumanTask
 * @apiName ActivateHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 */
router.post('/:id/activate', (req, res, next)=>{
  HumanTask.activate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} humantasks/:id/draft Draft HumanTask
 * @apiName DraftHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiParam {Array} taskParams An array of task paramerts
 * {
 * 	"id": "9411d2nyotg3",
 * 	"taskParams": [
 * 		{
 * 			"id": "8p599v61r2em",
 * 			"values": [„2“],
 * 		}
 * 	]
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "parentStage": "1x26mpxg3dabq",
 *   "index": 0,
 *   "stateDates": {
 *     "enabled": "2017-06-07 00:22:16.0",
 *     "terminated": null,
 *     "active": "2017-06-07 00:22:16.0",
 *     "available": "2017-06-07 00:22:16.0",
 *     "completed": null
 *   },
 *   "isRepeatable": false,
 *   "next": null,
 *   "state": "ACTIVE",
 *   "resourceType": "humantasks",
 *   "prev": null,
 *   "scheduledDate": null,
 *   "id": "9411d2nyotg3",
 *   "processDefinition": "6pg40n08k5yc",
 *   "possibleActions": [],
 *   "isManualActivation": false,
 *   "taskParams": [
 *     {
 *       "id": "w8xkoqye52ln",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "1 day",
 *             "value": "1"
 *           },
 *           {
 *             "description": "2 days",
 *             "value": "2"
 *           }
 *         ]
 *       },
 *       "values": [
 *         "2"
 *       ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Length of Stay (including day of admission and discharge)",
 *       "isMandatory": false,
 *       "name": "lace1",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     },
 *     {
 *       "id": "8p599v61r2em",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "No",
 *             "value": "0"
 *           },
 *           {
 *             "description": "Yes",
 *             "value": "1"
 *           }
 *         ]
 *       },
 *       "values": [ ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Was the patient admitted to hospital via the emergency department?",
 *       "isMandatory": false,
 *       "name": "lace2",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     }
 *   ],
 *   "description": "Lace",
 *   "name": "Lace",
 *   "isMandatory": true,
 *   "owner": null,
 *   "case": "1rx44jafa5psr"
 * }
 */
router.post('/:id/draft', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  HumanTask.draft(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /humantasks/:id/complete Complete HumanTask
 * @apiName CompleteHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiParam {Array} taskParams An array of task paramerts
 * @apiSampleRequest /humantask/:id/complete
 * {
 * 	"id": "9411d2nyotg3",
 * 	"taskParams": [
 * 		{
 * 			"id": "w8xkoqye52ln",
 * 			"values": [„1“],
 * 		},
 * 		{
 * 			"id": "8p599v61r2em",
 * 			"values": [„0“],
 * 		}
 * 	]
 * }

 * @apiSuccessExample {json} Success-Response:
 * {
 *   "parentStage": "1x26mpxg3dabq",
 *   "index": 0,
 *   "stateDates": {
 *     "enabled": "2017-06-07 00:22:16.0",
 *     "terminated": null,
 *     "active": "2017-06-07 00:22:16.0",
 *     "available": "2017-06-07 00:22:16.0",
 *     "completed": "2017-06-07 00:22:18.0"
 *   },
 *   "isRepeatable": false,
 *   "next": null,
 *   "state": "COMPLETED",
 *   "resourceType": "humantasks",
 *   "prev": null,
 *   "scheduledDate": null,
 *   "id": "9411d2nyotg3",
 *   "processDefinition": "6pg40n08k5yc",
 *   "possibleActions": [],
 *   "isManualActivation": false,
 *   "taskParams": [
 *     {
 *       "id": "w8xkoqye52ln",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "1 day",
 *             "value": "1"
 *           },
 *           {
 *             "description": "2 days",
 *             "value": "2"
 *           }
 *         ]
 *       },
 *       "values": [
 *         "2"
 *       ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Length of Stay (including day of admission and discharge)",
 *       "isMandatory": false,
 *       "name": "lace1",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     },
 *     {
 *       "id": "8p599v61r2em",
 *       "attributeTypeConstraints": {
 *         "enumerationOptions": [
 *           {
 *             "description": "No",
 *             "value": "0"
 *           },
 *           {
 *             "description": "Yes",
 *             "value": "1"
 *           }
 *         ]
 *       },
 *       "values": [
 *         "0"
 *       ],
 *       "isDerived": false,
 *       "defaultValues": [],
 *       "task": "9411d2nyotg3",
 *       "description": "Was the patient admitted to hospital via the emergency department?",
 *       "isMandatory": false,
 *       "name": "lace2",
 *       "isReadOnly": false,
 *       "attributeType": "enumeration",
 *       "multiplicity": "maximalOne",
 *       "resourceType": "taskparams"
 *     }
 *   ],
 *   "description": "Lace",
 *   "name": "Lace",
 *   "isMandatory": true,
 *   "owner": null,
 *   "case": "1rx44jafa5psr"
 * }
 */
router.post('/:id/complete', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  HumanTask.complete(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /humantasks/:id/terminate Terminate HumanTask
 * @apiName TerminateHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiSampleRequest /humantask/:id/terminate
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/terminate', (req, res, next)=>{
  HumanTask.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /humantasks/:id/correct Correct HumanTask
 * @apiName CorrectHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiSampleRequest /humantasks/:id/correct
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/correct', (req, res, next)=>{
    let data = req.body;
    data.id = req.params.id;
    HumanTask.correct(req.jwt, data)
      .then(c=>{
          res.status(200).send(c);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
  });

/**
 * @api {post} /humantasks/:id/owner/:userid Set HumanTask Owner
 * @apiName SetOwnerHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiParam {String} userId of the Owner
 * @apiSampleRequest /humantask/:id/owner/userid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/owner/:userid', (req, res, next)=>{
  HumanTask.setOwner(req.jwt, req.params.id, req.params.userid)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /humantasks/:id/duedate Set HumanTask Due Date
 * @apiName SetHumanTaskDueDate
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiParam {String} dueDate 
 * @apiSampleRequest /humantask/:id/duedate
 * {dueDate: 'some date'}
 * @apiSuccessExample {json} Success-Response:
 *     {}
 */
router.post('/:id/duedate', (req, res, next)=>{
  HumanTask.setDueDate(req.jwt, req.params.id, req.body.dueDate)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /humantasks/:id/externalid/:externalid Set HumanTask ExternalId
 * @apiName SetExternalIdHumanTask
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of a HumanTask
 * @apiParam {String} externalId
 * @apiSampleRequest /humantasks/:id/externalid/:externalid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/externalid/:externalid', (req, res, next)=>{
    HumanTask.setExternalId(req.jwt, req.params.id, req.params.externalid)
      .then(c=>{
          res.status(200).send(c);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
});

module.exports = router;
