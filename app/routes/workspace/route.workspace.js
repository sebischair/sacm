import express from 'express';
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
import Case from './../../models/case/model.case';
const router = express.Router();




/**
 * @api {get} /workspaces/:id/casedefinitions Get CaseDefinition by Workspace
 * @apiName GetCaseDefinitionsByWorkspaceID
 * @apiGroup CaseDefinition
 * @apiParam {String} ID The ID of the requested Workspace
 * @apiSampleRequest /workspaces/:id/casedefinitions
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "description":"Test Case Definition",
 *       "resourceType""CaseDefinition"
 *     }]
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




// INSTANCE LEVEL

/**
 * @api {get} /workspaces/:id/cases Get Case by Workspace
 * @apiName GetCasesByWorkspaceID
 * @apiGroup Case
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
  Case.findbyWorkspaceId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
