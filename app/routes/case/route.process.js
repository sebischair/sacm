import express from 'express';

var router = express.Router();
import Process from './../../models/case/model.process';
import Alert from './../../models/case/model.alert';

/**
 * @api {get} /process/:id Get Process
 *
 * @apiName GetProcess
 * @apiGroup Process
 *
 * @apiParam {String} id ID of the Process
 *
 * @apiSampleRequest /process/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      // Could be any process object, see model
 *      {
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
 *      }
 *
 */
router.get('/:id', (req, res, next)=>{
  Process.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /process/:id/alerts Get Alerts
 *
 * @apiName GetProcessAlerts
 * @apiGroup Process
 *
 * @apiParam {String} id ID of the Process
 *
 * @apiSampleRequest /process/:id/alerts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  [{
 *  	"id": "jdddqzyu6ser7",
 *    "process": "1rjdqzyu6ser9",
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
 *    "seenDate": null
 *  }]
 *
 */
router.get('/:id/alerts', (req, res, next)=>{
  Alert.findByProcessId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
