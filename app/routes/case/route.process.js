import express from 'express';
import Process from './../../models/case/model.process';
import Alert from './../../models/case/model.alert';
import Log from './../../models/case/model.log';
const router = express.Router();


/**
 * @api {get} /processes/:id Get Process
 * @apiName GetProcess
 * @apiGroup Processes 
 * @apiParam {String} id ID of the Process
 * @apiSampleRequest /processes/:id
 * @apiSuccessExample {json} Success-Response:
 *      // Could be any process object, see model
 *      {
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
 *      }
 *
 */
router.get('/:id', (req, res, next)=>{
  Process.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /processes/:id/alerts Get Alerts by Process
 * @apiName GetProcessAlerts
 * @apiGroup Alerts 
 * @apiParam {String} id ID of the Process 
 * @apiSampleRequest /processes/:id/alerts
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
  Alert.findByProcessId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /processes/:id/logs Get Logs by Process
 * @apiName GetProcessLogs
 * @apiGroup Logs 
 * @apiParam {String} id ID of the Process 
 * @apiSampleRequest /processes/:id/logs
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/logs', (req, res, next)=>{
  Log.findByProcessId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /processes/:id/owner/autocomplete Get Owner Autocomplete Options for Process
 * @apiName GetProcessOwnerAutocomplete
 * @apiGroup Processes 
 * @apiParam {String} id ID of the Process 
 * @apiSampleRequest /processes/:id/owner/autocomplete
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/owner/autocomplete', (req, res, next)=>{
  Process.autocompleteOwner(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
