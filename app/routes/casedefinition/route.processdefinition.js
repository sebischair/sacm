import express from 'express';

var router = express.Router();

// Models
import SentryDefinition from './../../models/casedefinition/model.sentrydefinition';
import HttpHookDefinition from './../../models/casedefinition/model.httphookdefinition'
import Process from './../../models/case/model.process'


/**
 * @api {get} /processdefinition/:id/sentrydefinitions Returns all SentryDefinitions for a ProcessDefinition
 *
 * @apiName GetSentryDefinitionByProcessDefinitionID
 * @apiGroup SentryDefinition
 *
 * @apiParam {String} id ID of the ProcessDefinitionID
 *
 * @apiSampleRequest /processdefinition/:id/sentrydefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO SENTRY_OBJ
 *   }
 *
 */
router.get('/:id/sentrydefinitions', (req, res, next)=>{
  SentryDefinition.findByProcessDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




/**
 * @api {get} /processdefinition/:id/httphookdefinitions Returns all HttpHookDefinitions for a ProcessDefinition
 *
 * @apiName GetHttpHookDefinitionByProcessDefinitionID
 * @apiGroup HttpHookDefinition
 *
 * @apiParam {String} id ID of the ProcessDefinition
 *
 * @apiSampleRequest /processdefinition/:id/httphookdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO HTTP_HOOk_DEF_OBJ
 *   }
 *
 */
router.get(':id/httphookdefinitions', (req, res, next)=>{
  HttpHookDefinition.findByProcessDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// INSTANCE


/**
 * @api {get} /processdefinition/:id/process Returns all Processes for a ProcessDefinition
 *
 * @apiName GetProcessesByProcessDefinitionID
 * @apiGroup Process
 *
 * @apiParam {String} id ID of the ProcessDefinitionID
 *
 * @apiSampleRequest /processdefinition/:id/process
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id/processes', (req, res, next)=>{
  Process.findByProcessDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
