import express from 'express';

var router = express.Router();
import HumanTask from './../../models/case/model.humantask';


/**
 * @api {get} humantask/:id Get HumanTask
 * @apiName GetHumanDefinition
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
 *   "resourceType": "HumanTask",
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
 *       "resourceType": "TaskParam"
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
 *       "resourceType": "TaskParam"
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
  HumanTask.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} humantask/:id/draft Draft HumanTask
 * @apiName DraftHumanTask
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
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
 *     HTTP/1.1 200 OK
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
 *   "resourceType": "HumanTask",
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
 *       "resourceType": "TaskParam"
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
 *       "resourceType": "TaskParam"
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
  var data = req.body.taskParams;
  data.id = req.params.id;
  HumanTask.draft(data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /humantask/:id/complete Complete HumanTask
 * @apiName CompleteHumanTask
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 * @apiParam {Array} taskParams An array of task paramerts
 *
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
 *     HTTP/1.1 200 OK
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
 *   "resourceType": "HumanTask",
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
 *       "resourceType": "TaskParam"
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
 *       "resourceType": "TaskParam"
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
  var data = req.body.taskParams;
  data.id = req.params.id;
  HumanTask.draft(data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /humantask/:id/terminate Terminate HumanTask
 * @apiName TerminateHumanTask
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 *
 * @apiSampleRequest /humantask/:id/terminate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/terminate', (req, res, next)=>{
  HumanTask.terminate(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

module.exports = router;
