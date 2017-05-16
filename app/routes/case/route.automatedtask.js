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
  AutomatedTask.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




/**
 * TODO CHECK IF ROUTE EXISTS
 * @api {delete} /automatedtask/:id Delete AutomatedTask
 * @apiName DeleteAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a CaseDefinition.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {}
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTask.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
