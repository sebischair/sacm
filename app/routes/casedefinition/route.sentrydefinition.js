import express from 'express';
var router = express.Router();
import SentryDefinition from './../../models/casedefinition/model.sentrydefinition';


/**
 * @api {get} /sentrydefinition/:id Get SentryDefinition
 *
 * @apiName GetSentryDefinition
 * @apiGroup SentryDefinition
 *
 * @apiParam {String} id ID of the SentryDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO SENTRY_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  SentryDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /sentrydefinition/:id Delete SentryDefinition
 *
 * @apiName DeleteSentryDefinition
 * @apiGroup SentryDefinition
 *
 * @apiParam {String} id ID of the SentryDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *    {
 *       "handler": "SentryDefinitionHandler2",
 *       "cause":"EntityNotFoundException",
 *       "message":"Could not find entity '1swihwfirljjhx'"
 *       "statusCode": 404
 *    }
 */
router.delete('/:id', (req, res, next)=>{
  SentryDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /sentrydefinitions Create SentryDefinition
 *
 * @apiName CreateSentryDefinition
 * @apiGroup SentryDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {} TODO
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
  SentryDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});

/**
 * @api {patch} /sentrydefinition/:id Update SentryDefinition
 *
 * @apiName UpdateSentryDefinition
 * @apiGroup SentryDefinition
 *
 * @apiParam {String} id The ID of the SentryDefinition
 * @apiParam {String} caseDefinition (optional) ID of the parent CaseDefinition
 * @apiParam {String} name (optional) Name of the StageDefinition (internal usage)
 * @apiParam {String} label (optional) Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable (optional) Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory (optional) Indicator if the stage should be mandatory
 * @apiParam {String} parent (optional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (optional) Array of preconditions for the stage
 *
 * @apiSampleRequest /test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {} TODO
 *
 */
router.patch('/', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: req.body.label,
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
  SentryDefinition.updateById(req.params.id, data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



module.exports = router;
