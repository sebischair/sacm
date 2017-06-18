import express from 'express';
var router = express.Router();
import SentryDefinition from './../../models/casedefinition/model.sentrydefinition';


/**
 * @api {get} /sentrydefinition/:id Get SentryDefinition
 * @apiName GetSentryDefinition
 * @apiGroup SentryDefinition
 * @apiParam {String} id ID of the SentryDefinition
 * @apiSampleRequest test
 * @apiSuccessExample {json} Success-Response:
 *    {
 *       "completedProcessDefinitions": [
 *         "t1rcejxgbgx8"
 *       ],
 *       "id": "1wsvcl29vax4p",
 *       "enablesProcessDefinition": "1kudcltcejsy3",
 *       "resourceType": "SentryDefinition"
 *    }
 */
router.get('/:id', (req, res, next)=>{
  SentryDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /sentrydefinition/:id Delete Sentry Definition
 * @apiName DeleteSentryDefinition
 * @apiGroup SentryDefinition
 * @apiParam {String} id ID of the Sentry Definition
 * @apiSampleRequest /sentrydefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  SentryDefinition.deleteById(req.jwt, req.params.id)
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
 * @apiParam {String} caseDefinition ID of the Case Definition
 * @apiParam {String} name Name of the Stage Definition (internal usage)
 * @apiParam {String} label Label of the Stage Definition
 * @apiParam {Boolean} isRepeatable Indicator if the stage is repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage is mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 * @apiSampleRequest /sentrydefinitions
 * @apiSuccessExample {json} Success-Response:
 *    {
 *       "completedProcessDefinitions": [
 *         "t1rcejxgbgx8"
 *       ],
 *       "id": "1wsvcl29vax4p",
 *       "enablesProcessDefinition": "1kudcltcejsy3",
 *       "resourceType": "SentryDefinition"
 *    }
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
  SentryDefinition.create(req.jwt, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});

/**
 * @api {patch} /sentrydefinition/:id Update Sentry Definition
 * @apiName UpdateSentryDefinition
 * @apiGroup SentryDefinition
 * @apiParam {String} id The ID of the Sentry Definition
 * @apiParam {String} caseDefinition (optional) ID of the parent Case Definition
 * @apiParam {String} name (optional) Name of the StageDefinition (internal usage)
 * @apiParam {String} label (optional) Label of the Stage Definition
 * @apiParam {Boolean} isRepeatable (optional) Indicator if the stage is repeatable
 * @apiParam {Boolean} isMandatory (optional) Indicator if the stage is mandatory
 * @apiParam {String} parent (optional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (optional) Array of preconditions for the stage
 * @apiSampleRequest /sentrydefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *    {
 *       "completedProcessDefinitions": [
 *         "t1rcejxgbgx8"
 *       ],
 *       "id": "1wsvcl29vax4p",
 *       "enablesProcessDefinition": "1kudcltcejsy3",
 *       "resourceType": "SentryDefinition"
 *    }
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
  SentryDefinition.updateById(req.jwt, req.params.id, data)
    .then(sd=>{
      res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});



module.exports = router;
