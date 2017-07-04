import express from 'express';
import SentryDefinition from './../../models/casedefinition/model.sentrydefinition';
import HttpHookDefinition from './../../models/casedefinition/model.httphookdefinition'
import Process from './../../models/case/model.process'
const router = express.Router();

/**
 * @api {get} /processdefinitions/:id/sentrydefinitions Get SentryDefinitions
 * @apiName GetSentryDefinitionByProcessDefinitionID
 * @apiGroup SentryDefinition
 * @apiParam {String} id ID of the ProcessDefinitionID
 * @apiSampleRequest /processdefinitions/:id/sentrydefinitions
 * @apiSuccessExample {json} Success-Response:
 *     [{
 *       "completedProcessDefinitions": [
 *         "t1rcejxgbgx8"
 *       ],
 *       "id": "1wsvcl29vax4p",
 *       "enablesProcessDefinition": "1kudcltcejsy3",
 *       "resourceType": "SentryDefinition"
 *     }]
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
 * @api {get} /processdefinitions/:id/httphookdefinitions Get HttpHookDefinitions
 * @apiName GetHttpHookDefinitionByProcessDefinitionID
 * @apiGroup HttpHookDefinition
 * @apiParam {String} id ID of the ProcessDefinition
 * @apiSampleRequest /processdefinitions/:id/httphookdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *     id: "i938uejh378",
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }]
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
 * @api {get} /processdefinitions/:id/process Get Processes by Process Definition
 * @apiName GetProcessesByProcessDefinitionID
 * @apiGroup Process
 * @apiParam {String} id ID of the Process Definition 
 * @apiSampleRequest /processdefinitions/:id/process
 * @apiSuccessExample {json} Success-Response:
 *   [{
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "description":"asdasdasd",
 *     "resourceType": "stagedefinitions",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }]
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
