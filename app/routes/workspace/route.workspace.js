import express from 'express';
import Workspace from './../../models/workspace/model.workspace';
import Case from './../../models/case/model.case';
import CaseDefinition from './../../models/casedefinition/model.casedefinition';
import HumanTask from './../../models/case/model.humantask';
import Alert from './../../models/case/model.alert';
import Message from './../../models/case/model.message';
const router = express.Router();




/**
 * @api {get} /workspaces/:id Get Workspace
 * @apiName GetByWorkspaceID
 * @apiGroup Workspaces
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
 * @apiGroup Workspaces
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
 * @api {get} /workspaces/:id/cases/me Get My Cases by Workspace
 * @apiName GetMyCasesByWorkspaceID
 * @apiGroup Cases
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/cases/me
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/cases/me', (req, res, next)=>{
  Case.findMeByWorkspace(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/cases/client/search Search Cases by client and by Workspace
 * @apiName GetClientCasesByWorkspaceID
 * @apiGroup Cases
 * @apiParam {String} ID The ID of the the Workspace
 * @apiParam {String} query The search string
 * @apiSampleRequest /workspaces/:id/cases/client/search?query=John
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/cases/client/search', (req, res, next)=>{
  Case.findClientCasesByWorkspace(req.jwt, req.params.id, req.query.query)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

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
  Case.findByWorkspaceId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/casedefinitions Get CaseDefinitions by Workspace
 * @apiName GetCaseDefinitionsByWorkspaceID
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/casedefinitions
 * @apiSuccessExample {json} Success-Response:
  * [
 *     {
 *         "id": "zer6c0a84qap",
 *         "summarySectionDefinitions": [
 *             {
 *                 "position": "CENTER",
 *                 "id": "13h0c6ion4yp8",
 *                 "paths": [
 *                     "GCS2_NRS.nrs8"
 *                 ],
 *                 "caseDefinition": "13h0c6ion4yp8",
 *                 "description": "Nutritional Risk Screening (NRS)",
 *                 "name": "GCS2_NRS",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "STRETCHED",
 *                 "id": "13i9479wu2aac",
 *                 "paths": [
 *                     "GCS2_PhysicalActivity.phactp1",
 *                     "GCS2_PhysicalActivity.phactp2",
 *                     "GCS2_PhysicalActivity.phactpx"
 *                 ],
 *                 "caseDefinition": "13i9479wu2aac",
 *                 "description": "Physical Activity",
 *                 "name": "GCS2_PhysicalActivity",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "LEFT",
 *                 "id": "14f3feapk9e5h",
 *                 "paths": [
 *                     "GCS2_Charlson.ch21"
 *                 ],
 *                 "caseDefinition": "14f3feapk9e5h",
 *                 "description": "Charlson",
 *                 "name": "GCS2_Charlson",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "LEFT",
 *                 "id": "1aed52vybajli",
 *                 "paths": [
 *                     "GCS2_GFI.gfi16"
 *                 ],
 *                 "caseDefinition": "1aed52vybajli",
 *                 "description": "Groningen Frailty Indicator (GFI)",
 *                 "name": "GCS2_GFI",
 *                 "uiReference": "body",
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "CENTER",
 *                 "id": "1w4izn4zhgnqn",
 *                 "paths": [
 *                     "GCS2_ADL.adl7"
 *                 ],
 *                 "caseDefinition": "1w4izn4zhgnqn",
 *                 "description": "Activities of Daily Living (ADL)",
 *                 "name": "GCS2_ADL",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "RIGHT",
 *                 "id": "ez54cgp6zcio",
 *                 "paths": [
 *                     "GCS2_MNASF.mnasf9"
 *                 ],
 *                 "caseDefinition": "ez54cgp6zcio",
 *                 "description": "Mini Nutritional Assesment (MNA-SF)",
 *                 "name": "GCS2_MNASF",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             },
 *             {
 *                 "position": "LEFT",
 *                 "id": "m7bjg34esivt",
 *                 "paths": [
 *                     "GCS2_ASA.asa"
 *                 ],
 *                 "caseDefinition": "m7bjg34esivt",
 *                 "description": "ASA",
 *                 "name": "GCS2_ASA",
 *                 "uiReference": null,
 *                 "resourceType": "summarysectiondefinitions"
 *             }
 *         ],
 *         "workspace": "2c9480885d1737ef015d74deed260006",
 *         "ownerPath": "GCS2_Owner",
 *         "description": "Groningen CS2",
 *         "name": "GCS2",
 *         "entityDefinition": "1tzlcpc3qdms6",
 *         "isInstantiable": true,
 *         "version": "1",
 *         "resourceType": "casedefinitions"
 *     }
 * ]
 */
router.get('/:id/casedefinitions', (req, res, next)=>{
  CaseDefinition.findByWorkspaceId(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/casedefinitions/caninstantiate Get CaseDefinitions that can be instantiated by Workspace
 * @apiName GetInstantiableCaseDefinitionsByWorkspaceID
 * @apiGroup CaseDefinitions
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/casedefinitions/caninstantiate
 * @apiSuccessExample {json} Success-Response:
 * [
 *     {
 *         "id": "zer6c0a84qap",
 *         "workspace": {
 *             "id": "2c9480885d1737ef015d74deed260006",
 *             "description": null,
 *             "name": "Umcg",
 *             "resourceType": "workspaces"
 *         },
 *         "description": "Groningen CS2",
 *         "name": "GCS2",
 *         "resourceType": "casedefinitions",
 *         "version": "1"
 *     }
 * ]
 */
router.get('/:id/casedefinitions/caninstantiate', (req, res, next)=>{
  CaseDefinition.canInstantiateByWorkspace(req.jwt, req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/humantasks/me/active Get My active Humantasks by Workspace
 * @apiName GetMyHumanTasksByWorkspace
 * @apiGroup HumanTasks
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/humantasks/me/active
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/humantasks/me/active', (req, res, next)=>{
  HumanTask.findMeActiveByWorkspaceId(req.jwt, req.params.id)
    .then(ht=>{
        res.status(200).send(ht);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/alerts/me/unseen Get My unseen Alerts by Workspace
 * @apiName GetMyUnseenAlertsByWorkspace
 * @apiGroup Alerts
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/alerts/me/unseen
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/alerts/me/unseen', (req, res, next)=>{
  Alert.findMeUnseenByWorkspace(req.jwt, req.params.id)
    .then(a=>{
        res.status(200).send(a);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/alerts/me/seen Mark My Alerts As seen by Workspace
 * @apiName PostMySeenAlertsByWorkspace
 * @apiGroup Alerts
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/alerts/me/seen
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.post('/:id/alerts/me/seen', (req, res, next)=>{
  Alert.seenByWorkspaceId(req.jwt, req.params.id)
    .then(a=>{
        res.status(200).send(a);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /workspaces/:id/messages/me/unseen Get My unseen Messages by Workspace
 * @apiName GetMyUnseenMessagesByWorkspace
 * @apiGroup Messages
 * @apiParam {String} ID The ID of the the Workspace
 * @apiSampleRequest /workspaces/:id/messages/me/unseen
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/messages/me/unseen', (req, res, next)=>{
  Message.findMeUnseenByWorkspace(req.jwt, req.params.id)
    .then(m=>{
        res.status(200).send(m);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
