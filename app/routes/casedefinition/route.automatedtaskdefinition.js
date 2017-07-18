import express from 'express';
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import AutomatedTask from './../../models/case/model.automatedtask';
const router = express.Router();

/**
 * @api {get} /automatedtaskdefinitions/:id Get AutomatedTaskDefinition
 * @apiName GetAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 * @apiSampleRequest /automatedtaskdefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "stagedefinitions",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /automatedtaskdefinitions/:id Delete AutomatedTaskDefinition
 * @apiName DeleteAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 * @apiSampleRequest /automatedtaskdefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.deleteById(req.jwt, req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtaskdefinitions Create AutomatedTaskDefinition
 * @apiName CreateAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} description Description of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 * @apiSampleRequest /automatedtaskdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "stagedefinitions",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 *
 */
router.post('/', (req, res, next)=>{
 AutomatedTaskDefinition.create(req.jwt, req.body)
  .then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



/**
 * @api {patch} /automatedtaskdefinitions/:id Update AutomatedTaskDefinition
 * @apiName UpdateAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} description Description of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 * @apiSampleRequest /automatedtaskdefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "stagedefinitions",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 */
router.patch('/:id', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  AutomatedTaskDefinition.updateById(req.jwt, data)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /automatedtaskdefinitions/:id/automatedtasks Get AutomatedTasks
 * @apiName GetAutomatedTasks
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 * @apiSampleRequest /automatedtaskdefinitions/:id/automatedtasks
 * @apiSuccessExample {json} Success-Response:
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
 *          "taskParams": [],
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "automatedtasks"
 *     }]
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findByTaskDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
