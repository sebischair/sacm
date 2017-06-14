import express from 'express';

var router = express.Router();
import AutomatedTask from './../../models/case/model.automatedtask';

/**
 * @api {get} /automatedtask/:id Get AutomatedTask
 * @apiName GetAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a AutomatedTask
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
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
 *     }
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTask.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




/**
 * @api {post} automatedtask/:id/draft Draft AutomatedTask
 * @apiName DraftAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a AutomatedTask
 * @apiParam {Array} taskParams An array of task paramerts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/draft', (req, res, next)=>{
  var data = req.body.taskParams;
  data.id = req.params.id;
  AutomatedTask.draft(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtask/:id/complete Complete AutomatedTask
 * @apiName CompleteAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a AutomatedTask
 * @apiParam {Array} taskParams An array of task paramerts
 *
 * @apiSampleRequest /automatedtask/:id/complete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/complete', (req, res, next)=>{
  var data = req.body.taskParams;
  data.id = req.params.id;
  AutomatedTask.complete(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtask/:id/terminate Terminate AutoatedTask
 * @apiName TerminateAutoatedTask
 * @apiGroup AutoatedTask
 *
 * @apiParam {Number} id Unique ID of a AutoatedTask
 *
 * @apiSampleRequest /automatedtask/:id/terminate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/terminate', (req, res, next)=>{
  AutomatedTask.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


module.exports = router;
