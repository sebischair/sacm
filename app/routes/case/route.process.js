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
 *   {
 *     TODO ALERT_OBJ
 *   }
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
