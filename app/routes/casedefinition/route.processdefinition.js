import express from 'express';

var router = express.Router();

// Models
import SentryDefinition from './../../models/casedefinition/model.sentrydefinition';
import HttpHookDefinition from './../../models/casedefinition/model.httphookdefinition'
import Process from './../../models/case/model.process'


/**
 * @api {get} /processdefinition/:id/sentrydefinitions Get SentryDefinitions
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
 *     [{
 *       "completedProcessDefinitions": [
 *         "t1rcejxgbgx8"
 *       ],
 *       "id": "1wsvcl29vax4p",
 *       "enablesProcessDefinition": "1kudcltcejsy3",
 *       "resourceType": "SentryDefinition"
 *     }]
 *
 */
router.get('/:id/sentrydefinitions', (req, res, next)=>{
  SentryDefinition.findByProcessDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




/**
 * @api {get} /processdefinition/:id/httphookdefinitions Get HttpHookDefinitions
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
 *   [{
 *     id: "i938uejh378",
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }]
 *
 */
router.get(':id/httphookdefinitions', (req, res, next)=>{
  HttpHookDefinition.findByProcessDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// INSTANCE


/**
 * @api {get} /processdefinition/:id/process Get Processes
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
 *   [{
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }, ... ]
 *
 */
router.get('/:id/processes', (req, res, next)=>{
  Process.findByProcessDefinitionId(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
