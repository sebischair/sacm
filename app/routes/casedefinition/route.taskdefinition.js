import express from 'express';
import Task from './../../models/case/model.task';
//import TaskDefinition from './../../models/casedefinition/model.taskdefinition';
const router = express.Router();


//TODO this is not implements in SC
/*
 * @api {get} /taskdefinition/:id Get Task Definition
 * @apiName GetTaskParamDefinitionByTaskDefinitionID
 * @apiGroup TaskDefinition
 * @apiParam {String} id ID of the TaskDefinition
 * @apiSampleRequest /taskdefinition/:id/taskparamdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *    id: "b9a51pgpkgbi"
 *    path: "Test.test",
 *    isReadOnly: true,
 *    taskDefinition: "qkx51pgpkgbi"
 *   }]
 */
router.get('/:id', (req, res, next)=>{
  TaskDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /taskdefinition/:id/tasks Get Tasks
 * @apiName GetTasksByTaskDefinitionID
 * @apiGroup TaskDefinition
 * @apiParam {String} id ID of the TaskDefinition
 * @apiSampleRequest /taskdefinition/:id/tasks
 * @apiSuccessExample {json} Success-Response:
 *     // List of Automated and/or HumanTasks
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
  Task.findByTaskDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
