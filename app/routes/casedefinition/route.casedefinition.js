import express from 'express';

var router = express.Router();

// Models
import CaseDefinition from './../../models/casedefinition/model.casedefinition';

// Middlewares
import Auth from './../../middlewares/middleware.auth';
import Authorizer from './../../middlewares/middleware.authorize';


/**
 * @api {post} /api/casedefinitions
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
    entityDefinition: {id: req.body.entityDefinition},
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
 * @api {get} /api/casedefinition/:id
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
 * @api {delete} /api/casedefinition/:id
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
 * @api {patch} /api/casedefinition/:id
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


router.get('/', (req, res, next)=>{
  CaseDefinition.find({})
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});





router.post(

  // Path
  '/x',

  // Middleware
  [
    // Authentication
    Auth.authenticate(
    'useOAuth2', {
      session: false
    })
    ,

    // Authorization of general resources
    new Authorizer().authorizeResource('create'),

    // Authorization on instance level
    new Authorizer().authorizeInstance()
  ],

  // Controller
  (req, res, next)=>{
    new CaseDefinition({
      name: 'test case'
    }).save().then(cd=>{
      res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
);

router.get('/:id/tree', (req, res, next)=>{
  CaseDefinition.calcCaseDefTree(req.params.id)
    .then(t=>{
      res.status(200).send(t);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});


module.exports = router;
