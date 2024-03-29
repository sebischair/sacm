import express from 'express';
import AutomatedTask from './../../models/case/model.automatedtask';
const router = express.Router();



/**
 * @api {get} /automatedtasks/:id Get AutomatedTask
 * @apiName GetAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {Number} id (mandatory) ID of a AutomatedTask
 * @apiSuccessExample {json} Success-Response:
 *     {
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "stateDates": {
 *            "enabled": "2017-05-15 17:29:18.0",
 *            "terminated": null,
 *            "active": null,
 *            "available": "2017-05-15 17:29:17.0",
 *            "completed": null
 *          },
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "automatedtasks"
 *     }
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTask.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/activate Activate AutomatedTask
 * @apiName ActivateAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {String} id (mandatory)  ID of a AutomatedTask
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/activate', (req, res, next)=>{
  AutomatedTask.activate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/draft Draft AutomatedTask
 * @apiName DraftAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {Number} id (mandatory)  ID of a AutomatedTask
 * @apiParam {Array} taskParams (mandatory) An array of task paramerts
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/draft', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  AutomatedTask.draft(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/complete Complete AutomatedTask
 * @apiName CompleteAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {Number} id (mandatory) ID of a AutomatedTask
 * @apiParam {Array} taskParams (mandatory) An array of task paramerts
 * @apiSampleRequest /automatedtask/:id/complete
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/complete', (req, res, next)=>{
  let data = req.body;
  data.id = req.params.id;
  AutomatedTask.complete(req.jwt, data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/terminate Terminate AutomatedTask
 * @apiName TerminateAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {Number} id (mandatory) ID of a AutomatedTask
 * @apiSampleRequest /automatedtask/:id/terminate
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/terminate', (req, res, next)=>{
  AutomatedTask.terminate(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/owner/:userid Set AutomatedTask Owner
 * @apiName SetOwnerAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {String} id ID of a AutomatedTask
 * @apiParam {String} userId of the Owner
 * @apiSampleRequest /automatedtask/:id/owner/userid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/owner/:userid', (req, res, next)=>{
  AutomatedTask.setOwner(req.jwt, req.params.id, req.params.userid)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtasks/:id/externalid/:externalid Set AutomatedTask ExternalId
 * @apiName SetExternalIdAutomatedTask
 * @apiGroup AutomatedTasks
 * @apiParam {String} id ID of a AutomatedTask
 * @apiParam {String} externalId
 * @apiSampleRequest /automatedtasks/:id/externalid/:externalid
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     }
 */
router.post('/:id/externalid', setExternalId);
router.post('/:id/externalid/:externalid', setExternalId);

function setExternalId(req, res){
    AutomatedTask.setExternalId(req.jwt, req.params.id, req.params.externalid, req.body)
        .then(c=>{
            res.status(200).send(c);
        })
        .catch(err=>{
            res.status(500).send(err);
        });
};

module.exports = router;
