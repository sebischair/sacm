import express from 'express';
var router = express.Router();
import StageDefinition from './../../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import Stage from './../../models/case/model.stage';


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



/**
 * @api {get} /stagedefinition/:id/automatedtaskdefinitions Returns all direct child AutomatedTaskDefinitions
 *
 * @apiName GetAutomatedTaskDefinitionByStageDefinitionID
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} ID The ID of the StageDefinition
 *
 * @apiSampleRequest /stagedefinition/:id/automatedtaskdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   [{
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
 *   }]
 *
 */
router.get('/:id/automatedtaskdefinitions', (req, res, next)=>{
  AutomatedTaskDefinition.findByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /stagedefinition/:id/humantaskdefinitions Returns all direct child HumanTaskDefinitions
 *
 * @apiName GetHumanTaskDefinitionByStageDefinitionID
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} ID The ID of the StageDefinition
 *
 * @apiSampleRequest /StageDefinition/:id/humantaskdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   [{
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
 *   }]
 *
 */
router.get('/:id/humantaskdefinitions', (req, res, next)=>{
  HumanTaskDefinition.findALLByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// stages

/**
 * @api {get} /stagedefinition/:id/stages Get instances of StageDefinition
 *
 * @apiName GetStagesByStageDefinitionId
 * @apiGroup StageDefinition
 *
 * @apiParam {String} id ID of the StageDefinition
 *
 * @apiSampleRequest /stagedefinition/:id/stages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO STAGE_OBJ
 *   }
 *
 */
 router.get('/:id/stages', (req, res, next)=>{
   Stage.findbyStageDefinitionId(req.params.id)
     .then(cd=>{
         res.status(200).send(cd);
     })
     .catch(err=>{
       res.status(500).send(err);
     })
 });


module.exports = router;
