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
 *     {
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
 *     }
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
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/draft', (req, res, next)=>{
  var data = req.body.taskParams;
  HumanTask.draft(req.params.id, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} humantask/:id/complete Complete HumanTask
 * @apiName CompleteHumanTask
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 * @apiParam {Array} taskParams An array of task paramerts
 *
 * @apiSampleRequest /humantask/:id/complete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id/complete', (req, res, next)=>{
  var data = req.body.taskParams;
  HumanTask.draft(req.params.id, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} humantask/:id/terminate Terminate HumanTask
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
