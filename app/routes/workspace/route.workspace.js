import express from 'express';
import Workspace from './../../models/workspace/model.workspace';
import Case from './../../models/case/model.case';
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
const router = express.Router();




/**
 * @api {get} /workspaces/:id Get Workspace
 * @apiName GetByWorkspaceID
 * @apiGroup Workspaces
 * @apiParam {String} ID The ID of the requested Workspace
 * @apiSampleRequest /workspaces/:id
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id', (req, res, next)=>{
  Workspace.findById(req.jwt, req.params.id)
    .then(w=>{
      res.status(200).send(w);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /workspaces Get Workspaces
 * @apiName Get Workspaces
 * @apiGroup Workspaces
 * @apiSampleRequest /workspaces
 * @apiSuccessExample {json} Success-Response:
 * [{
 *     "id": "2c9480845bee03e7015bfc03da610001",
 *     "name": "Assuta",
 *     "permissions": {
 *         "contributors": [
 *             {
 *                 "id": "2c9480845bee03e7015bfc03da610001",
 *                 "name": "Assuta",
 *                 "resourceType": "groups"
 *             }
 *         ],
 *         "administrators": [
 *             {
 *                 "id": "it25pjmg7hhf",
 *                 "name": "Max Mustermann",
 *                 "resourceType": "users"
 *             }
 *         ],
 *         "writers": [],
 *         "readers": [],
 *         "clients": [
 *             {
 *                 "id": "2c9480845bee03e7015bfc056b070002",
 *                 "name": "AssutaPatients",
 *                 "resourceType": "groups"
 *             }
 *         ]
 *     },
 *     "resourceType": "workspaces"
 * }]
 */
router.get('/', (req, res, next)=>{
  Workspace.findAll(req.jwt)
    .then(w=>{
      res.status(200).send(w);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /workspaces/:id/cases/me Get All My Cases by Workspace that can be access with the current user
 * @apiName GetWorkspaceCasesMe
 * @apiGroup Cases
 * @apiSampleRequest /workspace/:id/cases/me
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "id": "1q7nud4e2v1dl",
 *   "stateDates": {
 *     "enabled": "2017-05-15 17:29:14.0",
 *     "terminated": null,
 *     "active": null,
 *     "available": "2017-05-15 17:29:14.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "1xzmymv4hf0tj",
 *   "workspace": "1mwgok4jx7397",
 *   "description": "Demo Case London",
 *   "entity": "vcqm404srunk",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "resourceType": "cases"
 * }
 */
router.get('/:id/cases/me', (req, res, next)=>{
  //TODO need to be changed
  Case.findAllByWorkspaceId(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// INSTANCE LEVEL

/**
 * @api {get} /workspaces/:id/cases Get Case by Workspace
 * @apiName GetCasesByWorkspaceID
 * @apiGroup Cases
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/cases
 * @apiSuccessExample {json} Success-Response:
 * [{
 *   "id": "1q7nud4e2v1dl",
 *   "stateDates": {
 *     "enabled": "2017-05-15 17:29:14.0",
 *     "terminated": null,
 *     "active": null,
 *     "available": "2017-05-15 17:29:14.0",
 *     "completed": null
 *   },
 *   "caseDefinition": "1xzmymv4hf0tj",
 *   "workspace": "1mwgok4jx7397",
 *   "description": "Demo Case London",
 *   "entity": "vcqm404srunk",
 *   "name": "Democase",
 *   "state": "ENABLED",
 *   "owner": null,
 *   "resourceType": "cases"
 * }]
 */
router.get('/:id/cases', (req, res, next)=>{
  Case.findByWorkspaceId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/casedefinitions/caninstantiate Get CaseDefinitions that can be instantiated by Workspace
 * @apiName GetInstantiableCaseDefinitionsByWorkspaceID
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/casedefinitions/caninstantiate
 * @apiSuccessExample {json} Success-Response:
 * [
 *     {
 *         "id": "zer6c0a84qap",
 *         "workspace": {
 *             "id": "2c9480885d1737ef015d74deed260006",
 *             "description": null,
 *             "name": "Umcg",
 *             "resourceType": "workspaces"
 *         },
 *         "description": "Groningen CS2",
 *         "name": "GCS2",
 *         "resourceType": "casedefinitions",
 *         "version": "1"
 *     }
 * ]
 */
router.get('/:id/casedefinitions/caninstantiate', (req, res, next)=>{
  console.log('here')
  CaseDefinition.canInstantiateByWorkspace(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
