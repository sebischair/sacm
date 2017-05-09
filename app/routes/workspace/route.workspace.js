import express from 'express';

var router = express.Router();

// Models
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
import Case from './../../models/case/model.case';

/**
 * @api {get} /workspace/:id/casedefinitions Return all CaseDefinitions of the given Workspace
 *
 * @apiName GetCaseDefinitionsByWorkspaceID
 * @apiGroup CaseDefinition
 *
 * @apiParam {String} ID The ID of the requested Workspace
 *
 * @apiSampleRequest /workspace/:id/casedefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "workspace": "l304i3u2y91u",
 *       "entityDefinition": "1hvr3q9rvtys3",
 *       "name": "CaseDefinition1",
 *       "id": "qkx51pgpkgbi",
 *       "label": "Test Case Definition",
 *       "type": "CaseDefinition"
 *     }]
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




// INSTANCE LEVEL

/**
 * @api {get} /workspace/:id/cases Get all instances of the given Workspace
 *
 * @apiName GetCasesByWorkspaceID
 * @apiGroup Case
 *
 * @apiParam {String} ID The ID of the the Workspace
 *
 * @apiSampleRequest /workspace/:id/cases
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       TODO CASE_OBJ
 *     }
 *
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
