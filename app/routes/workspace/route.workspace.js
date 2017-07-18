import express from 'express';
import Workspace from './../../models/workspace/model.workspace';
const router = express.Router();




/**
 * @api {get} /workspaces/:id Get Workspace
 * @apiName GetByWorkspaceID
 * @apiGroup Workspace
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
 * @apiGroup Workspace
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
  Case.findbyWorkspaceId(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
