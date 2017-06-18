import express from 'express';
import StageDefinition from './../../models/casedefinition/model.stagedefinition';
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import Stage from './../../models/case/model.stage';
const router = express.Router();

/**
 * @api {post} /stagedefinitions Create StageDefinition
 * @apiName CreateStageDefinition
 * @apiGroup StageDefinition
 * @apiParam {String} caseDefinition ID of the parent Case Definition
 * @apiParam {String} name Name of the Stage Definition (internal usage)
 * @apiParam {String} label Label of the Stage Definition
 * @apiParam {Boolean} isRepeatable Indicator if the stage is repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage is mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 * @apiSampleRequest /stagedefinitions
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
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
  StageDefinition.create(req.jwt, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});


/**
 * @api {patch} /stagedefinition/:id Update StageDefinition
 * @apiName UpdateStageDefinition
 * @apiGroup StageDefinition
 * @apiParam {String} id The ID of the Stage Definition
 * @apiParam {String} caseDefinition (opional) ID of the parent Case Definition
 * @apiParam {String} name (opional) Name of the Stage Definition (internal usage)
 * @apiParam {String} label (opional) Label of the Stage Definition
 * @apiParam {Boolean} isRepeatable (opional) Indicator if the stage is repeatable
 * @apiParam {Boolean} isMandatory (opional) Indicator if the stage is mandatory
 * @apiParam {String} parent (opional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (opional) Array of preconditions for the stage
 * @apiSampleRequest /stagedefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType""StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
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
  StageDefinition.updateById(req.jwt, req.params.id, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});



/**
 * @api {get} /stagedefinition/:id Get StageDefinition
 * @apiName GetStageDefinition
 * @apiGroup StageDefinition
 * @apiParam {String} id ID of the Stage Definition
 * @apiSampleRequest /stagedefinition/:id 
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType""StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 */
router.get('/:id', (req, res, next)=>{
  StageDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /stagedefinition/:id Delete Stage Definition
 * @apiName DeleteStageDefinition
 * @apiGroup StageDefinition
 * @apiParam {String} id ID of the Stage Definition
 * @apiSampleRequest /stagedefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  StageDefinition.deleteById(req.jwt, req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /stagedefinition/:id/automatedtaskdefinitions Get Direct Child AutomatedTaskDefinitions
 * @apiName GetAutomatedTaskDefinitionByStageDefinitionID
 * @apiGroup AutomatedTaskDefinition
 * @apiParam {String} ID The ID of the Stage Definition
 * @apiSampleRequest /stagedefinition/:id/automatedtaskdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType""StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }]
 */
router.get('/:id/automatedtaskdefinitions', (req, res, next)=>{
  AutomatedTaskDefinition.findByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
      res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /stagedefinition/:id/humantaskdefinitions Get All HumanTaskDefinitions
 * @apiName GetHumanTaskDefinitionByStageDefinitionID
 * @apiGroup HumanTaskDefinition
 * @apiParam {String} ID The ID of the Stage Definition
 * @apiSampleRequest /stagedefinition/:id/humantaskdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType""StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }]
 */
router.get('/:id/humantaskdefinitions', (req, res, next)=>{
  HumanTaskDefinition.findALLByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
      res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// stages

/**
 * @api {get} /stagedefinition/:id/stages Get Stages by Stage Definitions
 * @apiName GetStagesByStageDefinitionId
 * @apiGroup StageDefinition
 * @apiParam {String} id ID of the StageDefinition
 * @apiSampleRequest /stagedefinition/:id/stages
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *       "processDefinition": "raxxde6yecyz",
 *       "id": "10kx8cvxs3t0w",
 *       "parentStage": null,
 *       "stateDates": {
 *         "enabled": null,
 *         "terminated": null,
 *         "active": null,
 *         "available": "2017-05-15 17:29:16.0",
 *         "completed": null
 *       },
 *       "description": "Case Identification",
 *       "name": "CaseIdentification",
 *       "state": "AVAILABLE",
 *       "children": [],
 *       "case": "1q7nud4e2v1dl",
 *       "resourceType": "Stage"
 *     }]
 */
 router.get('/:id/stages', (req, res, next)=>{
   Stage.findbyStageDefinitionId(req.jwt, req.params.id)
     .then(cd=>{
       res.status(200).send(cd);
     })
     .catch(err=>{
       res.status(500).send(err);
     })
 });


module.exports = router;
