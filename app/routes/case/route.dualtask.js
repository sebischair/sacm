import express from 'express';
import DualTask from './../../models/case/model.dualtask';
const router = express.Router();


/**
 * @api {get} dualtasks/me/active Get My DualTask that are active 
 * @apiName GetDualTask
 * @apiGroup DualTasks
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
 *   "resourceType": "dualtasks",
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
  DualTask.findMeActive(req.jwt)
    .then(hts=>{
        res.status(200).send(hts);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} dualtasks/:id Get DualTask
 * @apiName GetDualDefinition
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
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
 *   "resourceType": "dualtasks",
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
  DualTask.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} dualtasks/:id/activate Activate DualTask
 * @apiName ActivateDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 */
router.post('/:id/activate', (req, res, next)=>{
  DualTask.activate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} dualtasks/:id/humanpart/draft Draft DualTask human part
 * @apiName DraftDualTaskHumanPart
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
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
 *   "resourceType": "dualtasks",
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
router.post('/:id/humanpart/draft', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  DualTask.draftHumanPart(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} dualtasks/:id/automatedpart/draft Draft DualTask automated part
 * @apiName DraftDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
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
 *   "resourceType": "dualtasks",
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
router.post('/:id/automatedpart/draft', (req, res, next)=>{
    let data = req.body;
    data.id = req.params.id;
    DualTask.draftAutomatedPart(req.jwt, data)
      .then(c=>{
          res.status(200).send(c);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
  });

/**
 * @api {post} /dualtasks/:id/humanpart/complete Complete DualTask human part
 * @apiName CompleteDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {Array} taskParams An array of task paramerts
 * @apiSampleRequest /dualtasks/:id/humanpart/complete
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
 *   "resourceType": "dualtasks",
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
router.post('/:id/humanpart/complete', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  DualTask.completeHumanPart(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /dualtasks/:id/humanpart/correct Correct DualTask human part
 * @apiName CorrectHumanPartDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {Array} taskParams An array of task parameters
 * @apiSampleRequest /dualtasks/:id/correct
 * {}
 */
router.post('/:id/humanpart/correct', (req, res, next)=>{
 let data = req.body;
 data.id = req.params.id;
 DualTask.correctHumanPart(req.jwt, data)
   .then(c=>{
       res.status(200).send(c);
   })
   .catch(err=>{
       res.status(500).send(err);
   })
});

/**
 * @api {post} /dualtasks/:id/automatedpart/complete Complete DualTask automated part
 * @apiName CompleteDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {Array} taskParams An array of task paramerts
 * @apiSampleRequest /dualtasks/:id/complete
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
 *   "resourceType": "dualtasks",
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
router.post('/:id/automatedpart/complete', (req, res, next)=>{
    let data = req.body;
    data.id = req.params.id;
    DualTask.completeAutomatedPart(req.jwt, data)
      .then(c=>{
          res.status(200).send(c);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
  });

/**
 * @api {post} /dualtasks/:id/terminate Terminate DualTask
 * @apiName TerminateDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiSampleRequest /dualtasks/:id/terminate
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/terminate', (req, res, next)=>{
  DualTask.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /dualtasks/:id/owner/:userid Set DualTask Owner
 * @apiName SetOwnerDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {String} userId of the Owner
 * @apiSampleRequest /dualtask/:id/owner/userid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/owner/:userid', (req, res, next)=>{
  DualTask.setOwner(req.jwt, req.params.id, req.params.userid)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /dualtasks/:id/duedate Set DualTask Due Date
 * @apiName SetDualTaskDueDate
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {String} dueDate 
 * @apiSampleRequest /dualtask/:id/duedate
 * {dueDate: 'some date'}
 * @apiSuccessExample {json} Success-Response:
 *     {}
 */
router.post('/:id/duedate', (req, res, next)=>{
  DualTask.setDueDate(req.jwt, req.params.id, req.body.dueDate)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

/**
 * @api {post} /dualtasks/:id/externalid/:externalid Set DualTask ExternalId
 * @apiName SetExternalIdDualTask
 * @apiGroup DualTasks
 * @apiParam {String} id ID of a DualTask
 * @apiParam {String} externalId
 * @apiSampleRequest /dualtasks/:id/externalid/:externalid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/externalid/:externalid', (req, res, next)=>{
    DualTask.setExternalId(req.jwt, req.params.id, req.params.externalid)
      .then(c=>{
          res.status(200).send(c);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
});

module.exports = router;
