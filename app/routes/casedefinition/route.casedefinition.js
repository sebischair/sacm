import express from 'express';

var router = express.Router();

// Models
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import Case from './../../models/case/model.case';
import StageDefinition from './../../models/casedefinition/model.stagedefinition';

// Middlewares
import Auth from './../../middlewares/middleware.auth';
import Authorizer from './../../middlewares/middleware.authorize';


/**
 * @api {post} /casedefinitions Create CaseDefinition
 * @apiName CreateCaseDefinition
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} name A name for CaseDefinition (internal usage)
 * @apiParam {String} label A label for the CaseDefinition
 * @apiParam {String} entityDefinition The ID the EntityDefinition that belongs to the CaseDefinition
 * @apiParam {String} ownerPath A string notation-based path to the owner of the CaseDefinition
 *
 * @apiSampleRequest /casedefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "label": "Test Case Definition",
 *       "type": "CaseDefinition"
 *     }
 *
 */
router.post('/', (req, res, next)=>{
  var data = {
    name: req.body.name,
    label: req.body.label,
    entityDefinition: req.body.entityDefinition,
    ownerPath: req.body.ownerPath
  }
  CaseDefinition.create(data)
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinition/:id Get CaseDefinition
 *
 * @apiName GetCaseDefinition
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} ID The ID of the requested CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "label": "Test Case Definition",
 *       "type": "CaseDefinition"
 *     }
 *
 */
router.get('/:id', (req, res, next)=>{
  CaseDefinition.findById(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinition/:id/tree Get CaseDefinition Tree
 *
 * @apiName GetCaseDefinitionTree
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} ID The ID of the requested CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "children": [],
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "label": "Test Case Definition",
 *       "type": "CaseDefinition"
 *     }
 *
 */
router.get('/:id/tree', (req, res, next)=>{
  CaseDefinition.findTreeById(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /casedefinition/:id Delete CaseDefinition
 *
 * @apiName DeleteCaseDefinition
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition that should be deleted
 *
 * @apiSampleRequest /casedefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  CaseDefinition.findById(req.params.id)
    .then(cd=>{
        console.log(cd);
        return cd.remove();
    })
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /casedefinition/:id Update CaseDefinition
 *
 * @apiName UpdateCaseDefinition
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiParam {String} name (optional) Sets a name for the CaseDefinition
 * @apiParam {String} label (optional) Sets a label for the CaseDefinition
 * @apiParam {String} entityDefinition (optional) Assigns a new EntityDefinition
 * @apiParam {String} name (optional) Sets a owner path for the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "label": "Test Case Definition",
 *       "type": "CaseDefinition"
 *     }
 *
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    name: '',
    label: req.body.label,
    entityDefinition: {id: req.body.entityDefinition},
    ownerPath: req.body.ownerPath
  }
  CaseDefinition.updateById(req.params.id, data)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /casedefinition/:id/stagedefinitions Get Child StageDefinitions
 *
 * @apiName GetStageDefinitionByCaseDefinitionID
 * @apiGroup StageDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/stagedefinitions
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
router.get('/:id/stagedefinitions', (req, res, next)=>{
  StageDefinition.findByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinition/:id/stagedefinitions/all Get All StageDefinitions
 *
 * @apiName GetAllStageDefinitionByCaseDefinitionID
 * @apiGroup StageDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/stagedefinitions/all
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
router.get('/:id/stagedefinitions/all', (req, res, next)=>{
  StageDefinition.findALLByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /casedefinition/:id/automatedtaskdefinitions Get Child AutomatedTaskDefinitions
 *
 * @apiName GetAutomatedTaskDefinitionByCaseDefinitionID
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/automatedtaskdefinitions
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
 * @api {get} /casedefinition/:id/automatedtaskdefinitions/all Get All AutomatedTaskDefinitions
 *
 * @apiName GetAutomatedTaskDefinitionByCaseDefinitionID
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/automatedtaskdefinitions/all
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
router.get('/:id/automatedtaskdefinitions/all', (req, res, next)=>{
  AutomatedTaskDefinition.findALLByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /casedefinition/:id/humantaskdefinitions Get Child HumanTaskDefinitions
 *
 * @apiName GetHumanTaskDefinitionByCaseDefinitionID
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/humantaskdefinitions
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




/**
 * @api {get} /casedefinition/:id/humantaskdefinitions/all Get All HumanTaskDefinitions
 *
 * @apiName GetHumanTaskDefinitionByCaseDefinitionID
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} ID The ID of the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/humantaskdefinitions/all
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
router.get('/:id/humantaskdefinitions/all', (req, res, next)=>{
  HumanTaskDefinition.findALLByCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// INSTANCE LEVEL

/**
 * @api {get} /casedefinition/:id/cases Get CaseDefinitions
 *
 * @apiName GetCasesByCaseDefinition
 * @apiGroup Case
 *
 * @apiParam {String} ID The ID of the the CaseDefinition
 *
 * @apiSampleRequest /casedefinition/:id/cases
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       TODO CASE_OBJ
 *     }
 *
 */
router.get('/:id/cases', (req, res, next)=>{
  Case.findbyCaseDefinitionId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
