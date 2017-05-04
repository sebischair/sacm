import express from 'express';

var router = express.Router();

// Models
import CaseDefinition from './../../models/casedefinition/model.casedefinition';

// Middlewares
import Auth from './../../middlewares/middleware.auth';
import Authorizer from './../../middlewares/middleware.authorize';


/**
 * @api {post} /casedefinitions Creates a new CaseDefinition
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 406 IllegalStateException
 *     {
 *       "handler": "CaseDefinitionsHandler2",
 *       "cause": "IllegalStateException",
 *       "message": "cannot make persistent because is not consistent: [uid=caseDefinition2/1hvl6nyxyn8, state: transient] invalid features: \"name\", value: \"null\", error message: \"Cannot be empty.\", \"entityDefinition\", value: \"null\", error message: \"Cannot be empty.\"",
 *       "statusCode": 406
 *     }
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 NotFound
 *    {
 *      "handler":"CaseDefinitionHandler2",
 *      "cause":"EntityNotFoundException",
 *      "message":"Could not find entity 'qkx51pgpkgbis'",
 *      "statusCode":404
 *    }
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
 * @api {get} /casedefinition/:id/tree Get CaseDefinition including all its childern
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 NotFound
 *    {
 *      "handler":"CaseDefinitionHandler2",
 *      "cause":"EntityNotFoundException",
 *      "message":"Could not find entity 'qkx51pgpkgbis'",
 *      "statusCode":404
 *    }
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
 * @api {delete} /casedefinition/:id Delete a CaseDefinition
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 NotFound
 *    {
 *      "handler":"CaseDefinitionHandler2",
 *      "cause":"EntityNotFoundException",
 *      "message":"Could not find entity 'qkx51pgpkgbis'",
 *      "statusCode":404
 *    }
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
 * @api {patch} /casedefinition/:id Updates a specific CaseDefinition
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 405 NotFound
 *    {
 *      "handler":"CaseDefinitionHandler2",
 *      "cause":"EntityNotFoundException",
 *      "message":"Could not find entity 'qkx51pgpkgbis'",
 *      "statusCode":404
 *    }
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    name: '',
    label: req.body.label,
    entityDefinition: {id: req.body.entityDefinition},
    ownerPath: req.body.ownerPath
  }
  CaseDefinition.updateById(data)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


router.get('workspaces/:id/casedefinitions', (req, res, next)=>{
  CaseDefinition.find({})
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});






module.exports = router;
