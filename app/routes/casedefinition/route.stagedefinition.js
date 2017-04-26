import express from 'express';
var router = express.Router();
import StageDefinition from './../../models/casedefinition/model.stagedefinition';


/**
 * @api {post} /stagedefinitions Creates a new StageDefinition
 *
 * @apiName CreateStageDefinition
 * @apiGroup StageDefinition
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
  StageDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


/**
 * @api {patch} /stagedefinition/:id Updates a specific StageDefinition
 *
 * @apiName UpdateStageDefinition
 * @apiGroup StageDefinition
 *
 * @apiParam {String} id The ID of the StageDefinition
 * @apiParam {String} caseDefinition (opional) ID of the parent CaseDefinition
 * @apiParam {String} name (opional) Name of the StageDefinition (internal usage)
 * @apiParam {String} label (opional) Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable (opional) Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory (opional) Indicator if the stage should be mandatory
 * @apiParam {String} parent (opional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (opional) Array of preconditions for the stage
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
router.patch('/:id', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: 'asdasdasd',
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
  StageDefinition.updateById(req.params.id, data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



/**
 * @api {get} /stagedefinition/:id Get StageDefinition
 *
 * @apiName GetStageDefinition
 * @apiGroup StageDefinition
 *
 * @apiParam {String} id ID of the StageDefinition
 *
 * @apiSampleRequest test
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
 *     HTTP/1.1 404 Not found
 *    {
 *       "handler": "StageDefinitionsHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.get('/:id', (req, res, next)=>{
  StageDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /stagedefinition/:id Delete StageDefinition
 *
 * @apiName DeleteStageDefinition
 * @apiGroup StageDefinition
 *
 * @apiParam {String} id ID of the StageDefinition
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
  StageDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
