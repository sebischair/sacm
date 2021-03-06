import express from 'express';
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import HumanTask from './../../models/case/model.humantask';
const router = express.Router();

/**
 * @api {get} /humantaskdefinition/:id Get HumanTaskDefinition
 * @apiName GetHumanTaskDefinition
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} id ID of the HumanTaskDefinition
 * @apiSampleRequest test
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
  HumanTaskDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /humantaskdefinition/:id Delete HumanTaskDefinition
 * @apiName Delete HumanTaskDefinition
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} id ID of the HumanTaskDefinition
 * @apiSampleRequest test
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  HumanTaskDefinition.deleteById(req.jwt, req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /humantaskdefinitions Create HumanTaskDefinition
 * @apiName CreateHumanTaskDefinition
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} description Description of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 * @apiSampleRequest /humantaskdefinitions
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
router.post('/', (req, res, next)=>{
 HumanTaskDefinition.create(req.jwt, req.body)
  .then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


/**
 * @api {patch} /humantaskdefinitions/:id Update HumanTaskDefinition
 * @apiName UpdateHumanTaskDefinition
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} id The ID of the HumanTaskDefinition
 * @apiParam {String} caseDefinition (optional) ID of the parent CaseDefinition
 * @apiParam {String} name (optional) Name of the StageDefinition (internal usage)
 * @apiParam {String} description (optional) Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable (optional) Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory (optional) Indicator if the stage should be mandatory
 * @apiParam {String} parent (optional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (optional) Array of preconditions for the stage
 * @apiSampleRequest /humantaskdefinitions/:id
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
  HumanTaskDefinition.updateById(req.jwt, data)
   .then(sd=>{
     res.status(200).send(sd);
   })
   .catch(err=>{
     res.status(500).send(err);
   });
});


/**
 * @api {get} /humantaskdefinitions/:id/humantasks Get HumanTasks
 * @apiName GetHumanTaskDefinitions
 * @apiGroup HumanTasks
 * @apiParam {String} id ID of the HumanTaskDefinition
 * @apiSampleRequest /humantaskdefinitions/:id/humantasks
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *          "scheduledDate": null,
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
 *          "resourceType": "humantasks"
 *     }]
 */
router.get('/:id/humantasks', (req, res, next)=>{
  HumanTask.findByTaskDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
