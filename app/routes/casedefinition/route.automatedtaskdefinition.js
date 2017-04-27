import express from 'express';
var router = express.Router();
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';

/**
 * @api {get} /automatedtaskdefinition/:id Get AutomatedTaskDefinition
 *
 * @apiName GetAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *    {
 *       "handler": "AutomatedTaskDefinitionHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /automatedtaskdefinition/:id Delete AutomatedTaskDefinition
 *
 * @apiName DeleteAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *    {
 *       "handler": "AutomatedTaskDefinitionHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtaskdefinitions Creates a new AutomatedTaskDefinition
 *
 * @apiName CreateAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /automatedtaskdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "label": "asdasdasd",
 *     "type": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 406 IllegalStateException
 *    {
 *       "handler": "AutomatedTaskDefinitionHandler2",
 *       "cause": "IllegalStateException",
 *       "message": "cannot make persistent because is not consistent: [uid=stageDefinition2/19spff10zvqnt, state: transient] invalid features: \"name\", value: \"null\", error message: \"Cannot be empty.\", \"label\", value: \"null\", error message: \"Cannot be empty.\", \"isRepeatable\", value: \"null\", error message: \"Cannot be empty.\", \"isMandatory\", value: \"null\", error message: \"Cannot be empty.\", \"caseDefinition\", value: \"null\", error message: \"Cannot be empty.\"",
 *       "statusCode": 406
 *    }
 */
router.post('/', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: req.body.label,
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
 AutomatedTaskDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});

module.exports = router;
