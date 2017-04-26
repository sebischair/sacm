import express from 'express';
var router = express.Router();
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';


/**
 * @api {get} /humantaskdefinition/:id Get HumanTaskDefinition
 *
 * @apiName GetHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id ID of the HumanTaskDefinition
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
 *       "handler": "HumanTaskDefinitionHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.get('/:id', (req, res, next)=>{
  HumanTaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /humantaskdefinition/:id Delete HumanTaskDefinition
 *
 * @apiName Delete HumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id ID of the HumanTaskDefinition
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
 *       "handler": "StageDefinitionsHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.delete('/:id', (req, res, next)=>{
  HumanTaskDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /humantaskdefinitions Creates a new HumanTaskDefinition
 *
 * @apiName CreateHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /stagedefinitions
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
 *       "handler": "StageDefinitionsHandler2",
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
 HumanTaskDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


/**
 * @api {patch} /humantaskdefinition/:id Updates a specific HumanTaskDefinition
 *
 * @apiName UpdateHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id The ID of the HumanTaskDefinition
 * @apiParam {String} caseDefinition (optional) ID of the parent CaseDefinition
 * @apiParam {String} name (optional) Name of the StageDefinition (internal usage)
 * @apiParam {String} label (optional) Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable (optional) Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory (optional) Indicator if the stage should be mandatory
 * @apiParam {String} parent (optional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (optional) Array of preconditions for the stage
 *
 * @apiSampleRequest /test
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
 *       "handler": "StageDefinitionsHandler2",
 *       "cause": "IllegalStateException",
 *       "message": "cannot make persistent because is not consistent: [uid=stageDefinition2/19spff10zvqnt, state: transient] invalid features: \"name\", value: \"null\", error message: \"Cannot be empty.\", \"label\", value: \"null\", error message: \"Cannot be empty.\", \"isRepeatable\", value: \"null\", error message: \"Cannot be empty.\", \"isMandatory\", value: \"null\", error message: \"Cannot be empty.\", \"caseDefinition\", value: \"null\", error message: \"Cannot be empty.\"",
 *       "statusCode": 406
 *    }
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: req.body.label,
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
  HumanTaskDefinition.updateById(req.params.id, data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


module.exports = router;
