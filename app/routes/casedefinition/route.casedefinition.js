import express from 'express';
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import Case from './../../models/case/model.case';
import StageDefinition from './../../models/casedefinition/model.stagedefinition';
const router = express.Router();



/**
 * @api {get} /casedefinitions/caninstantiate Get CaseDefinition that can be instantiated by the current user
 * @apiName CanInstantiateCaseDefinition
 * @apiGroup CaseDefinitions
 * @apiSampleRequest /casedefinitions/caninstantiate
 * @apiSuccessExample {json} Success-Response:
 * [
 *     {
 *         "id": "bkglo0oqesag",
 *         "workspace": {
 *             "id": "1mql67cprqj71",
 *             "description": null,
 *             "name": "Barcelona Hospital"
 *         },
 *         "description": "Demo Case London",
 *         "name": "Democase"
 *     }
 * ]
 */
router.get('/caninstantiate', (req, res, next)=>{
  CaseDefinition.canInstantiate(req.jwt)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /casedefinitions/:id/disableinstantiation Disable instantiation of CaseDefinition
 * @apiName DisableCaseDefinitionInstantiation
 * @apiGroup CaseDefinitions
 * @apiSampleRequest /casedefinitions/:id/disableinstantiation
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.post('/:id/disableinstantiation', (req, res, next)=>{
  CaseDefinition.disableInstantiation(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /casedefinitions Create CaseDefinition
 * @apiName CreateCaseDefinition
 * @apiGroup CaseDefinitions
 * @apiParam {String} name A name for CaseDefinition (internal usage)
 * @apiParam {String} description A description for the CaseDefinition
 * @apiParam {String} entityDefinition The ID the EntityDefinition that belongs to the CaseDefinition
 * @apiParam {String} ownerPath A string notation-based path to the owner of the CaseDefinition
 * @apiSampleRequest /casedefinitions
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "description":"Test Case Definition",
 *       "resourceType""CaseDefinition"
 *     }
 */
router.post('/', (req, res, next)=>{
  CaseDefinition.create(req.jwt, req.body)
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinitions/version Get CaseDefinition Versions
 * @apiName GetCaseDefinitionVersions
 * @apiGroup CaseDefinitions
 * @apiSampleRequest /casedefinitions/versions
 * @apiSuccessExample {json} Success-Response:
 *     {}
 */
router.get('/versions', (req, res, next)=>{
  CaseDefinition.versions(req.jwt)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});

/**
 * @api {get} /casedefinitions/:id Get CaseDefinition
 * @apiName GetCaseDefinition
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the requested CaseDefinition
 * @apiSampleRequest /casedefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "description":"Test Case Definition",
 *       "resourceType""CaseDefinition"
 *     }
 */
router.get('/:id', (req, res, next)=>{
  CaseDefinition.findById(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinitions/:id/tree Get CaseDefinition Tree
 * @apiName GetCaseDefinitionTree
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the requested CaseDefinition
 * @apiSampleRequest /casedefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "children": [],
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "description":"Test Case Definition",
 *       "resourceType""CaseDefinition"
 *     }
 */
router.get('/:id/tree', (req, res, next)=>{
  CaseDefinition.findTreeById(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /casedefinitions/:id Delete CaseDefinition
 * @apiName DeleteCaseDefinition
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *     {}
 */
router.delete('/:id', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  CaseDefinition.deleteById(req.jwt, req.params.id)
    .then(data=>{
       res.status(200).send(data);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /casedefinitions/:id Update CaseDefinition
 * @apiName UpdateCaseDefinition
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiParam {String} name (optional) Sets a name for the CaseDefinition
 * @apiParam {String} description (optional) Sets a description for the CaseDefinition
 * @apiParam {String} entityDefinition (optional) Assigns a new EntityDefinition
 * @apiParam {String} name (optional) Sets a owner path for the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "description":"Test Case Definition",
 *       "resourceType""CaseDefinition"
 *     }
 */
router.patch('/:id', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  CaseDefinition.updateById(req.jwt, data)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /casedefinitions/:id/stagedefinitions Get Direct Child StageDefinitions
 * @apiName GetStageDefinitionByCaseDefinitionID
 * @apiGroup StageDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/stagedefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
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
 *   }]
 */
router.get('/:id/stagedefinitions', (req, res, next)=>{
  StageDefinition.findByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /casedefinitions/:id/stagedefinitions/all Get All StageDefinitions
 * @apiName GetAllStageDefinitionByCaseDefinitionID
 * @apiGroup StageDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/stagedefinitions/all
 * @apiSuccessExample {json} Success-Response:
 *   [{
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
 *   }]
 */
router.get('/:id/stagedefinitions/all', (req, res, next)=>{
  StageDefinition.findALLByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /casedefinitions/:id/automatedtaskdefinitions Get Direct Child AutomatedTaskDefinitions
 * @apiName GetAutomatedTaskDefinitionByCaseDefinitionID
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/automatedtaskdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
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
 * @api {get} /casedefinitions/:id/automatedtaskdefinitions/all Get All AutomatedTaskDefinitions
 * @apiName GetAutomatedTaskDefinitionByCaseDefinitionID
 * @apiGroup AutomatedTaskDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/automatedtaskdefinitions/all
 * @apiSuccessExample {json} Success-Response:
 *   [{
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
 *   }]
 */
router.get('/:id/automatedtaskdefinitions/all', (req, res, next)=>{
  AutomatedTaskDefinition.findALLByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /casedefinitions/:id/humantaskdefinitions Get Child HumanTaskDefinitions
 * @apiName GetHumanTaskDefinitionByCaseDefinitionID
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/humantaskdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
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




/**
 * @api {get} /casedefinitions/:id/humantaskdefinitions/all Get All HumanTaskDefinitions
 * @apiName GetHumanTaskDefinitionByCaseDefinitionID
 * @apiGroup HumanTaskDefinitions
 * @apiParam {String} ID The ID of the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/humantaskdefinitions/all
 * @apiSuccessExample {json} Success-Response:
 *   [{
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
 *   }]
 */
router.get('/:id/humantaskdefinitions/all', (req, res, next)=>{
  HumanTaskDefinition.findALLByCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// INSTANCE LEVEL

/**
 * @api {get} /casedefinitions/:id/cases Get CaseDefinitions
 * @apiName GetCasesByCaseDefinition
 * @apiGroup Cases
 * @apiParam {String} ID The ID of the the CaseDefinition
 * @apiSampleRequest /casedefinitions/:id/cases
 * @apiSuccessExample {json} Success-Response:
 *    [{
 *      "id": "1q7nud4e2v1dl",
 *      "stateDates": {
 *        "enabled": "2017-05-15 17:29:14.0",
 *        "terminated": null,
 *        "active": null,
 *        "available": "2017-05-15 17:29:14.0",
 *        "completed": null
 *      },
 *      "caseDefinition": "1xzmymv4hf0tj",
 *      "workspace": "1mwgok4jx7397",
 *      "description": "Demo Case London",
 *      "entity": "vcqm404srunk",
 *      "name": "Democase",
 *      "state": "ENABLED",
 *      "owner": null,
 *      "resourceType": "cases"
 *    }]
 */
router.get('/:id/cases', (req, res, next)=>{
  Case.findbyCaseDefinitionId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
