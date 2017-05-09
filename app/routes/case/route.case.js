import express from 'express';

var router = express.Router();
import Case from './../../models/case/model.case';
import Process from './../../models/case/model.process';
import Stage from './../../models/case/model.stage';
import Task from './../../models/case/model.task';
import HumanTask from './../../models/case/model.humantask';
import AutomatedTask from './../../models/case/model.automatedtask';
import Message from './../../models/case/model.message';
import Alert from './../../models/case/model.alert';
import Summary from './../../models/case/model.summary';

/**
 * @api {get} /case/:id Get Case
 *
 * @apiName GetCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO CASE_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Case.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id Get complete Case tree
 *
 * @apiName GetCaseTree
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO CASE_OBJ_TREE
 *   }
 *
 */
router.get('/:id/tree', (req, res, next)=>{
  Case.findTreebyId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /case/:id/complete Complete Case
 *
 * @apiName CompleteCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/complete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.post('/:id/complete', (req, res, next)=>{
  Case.complete(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /case/:id/complete Terminate Case
 *
 * @apiName TerminateCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/terminate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.post('/:id/terminate', (req, res, next)=>{
  Case.terminate(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id Delete Case
 *
 * @apiName DeleteCase
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.delete('/:id', (req, res, next)=>{
  Case.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// processes

/**
 * @api {get} /case/:id/processes Return direct child processes for the given case
 *
 * @apiName GetDirectChildProcesses
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/processes
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id/processes', (req, res, next)=>{
  Process.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/processes/all Return all processes for the given case
 *
 * @apiName GetAllProcesses
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/processes/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id/processes/all', (req, res, next)=>{
  Process.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// stages

/**
 * @api {get} /case/:id/stages Return direct child stages for the given case
 *
 * @apiName GetDirectChildStages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/stages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO STAGE_OBJ
 *   }
 *
 */
router.get('/:id/stages', (req, res, next)=>{
  Stage.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/stages/all Get stages for the given case
 *
 * @apiName GetStages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/stages/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO STAGE_OBJ
 *   }
 *
 */
router.get('/:id/stages/all', (req, res, next)=>{
  Stage.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// tasks

/**
 * @api {get} /case/:id/tasks Get direct child tasks for the given case
 *
 * @apiName GetTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_OBJ
 *   }
 *
 */
router.get('/:id/tasks/all', (req, res, next)=>{
  Task.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/tasks/all Get all tasks for the given case
 *
 * @apiName GetAllTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_OBJ
 *   }
 *
 */
router.get('/:id/tasks/all', (req, res, next)=>{
  Task.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/humantasks Get direct child human tasks for the given case
 *
 * @apiName GetHumanTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/humantasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO HUMAN_TASK_OBJ
 *   }
 *
 */
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/humantasks/all Get all human tasks for the given case
 *
 * @apiName GetAllHumanTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/humantasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO HUMAN_TASK_OBJ
 *   }
 *
 */
router.get('/:id/humantasks/all', (req, res, next)=>{
  HumanTask.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {get} /case/:id/automatedtasks Get direct child automated tasks for the given case
 *
 * @apiName GetAutomatedTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/automatedtasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO AUTOMATED_TASK_OBJ
 *   }
 *
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /case/:id/automatedtasks/all Get all tasks for the given case
 *
 * @apiName GetAllAutomatedTasks
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/tasks/all
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO AUTOMATED_TASK_OBJ
 *   }
 *
 */
router.get('/:id/automatedtasks/all', (req, res, next)=>{
  AutomatedTask.findALLbyCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// messages

/**
 * @api {get} /case/:id/messages Get all messages for the given case
 *
 * @apiName GetMessages
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/messages
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO MESSAGE_OBJ
 *   }
 *
 */
router.get('/:id/messages', (req, res, next)=>{
  Message.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


// alerts


/**
 * @api {get} /case/:id/alerts Get all alerts for the given case
 *
 * @apiName GetAlerts
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/alerts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO ALERT_OBJ
 *   }
 *
 */
router.get('/:id/alerts', (req, res, next)=>{
  Alert.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

// summary

/**
 * @api {get} /case/:id/summary Get Case summary
 *
 * @apiName GetSummary
 * @apiGroup Case
 *
 * @apiParam {String} id ID of the Case
 *
 * @apiSampleRequest /case/:id/summary
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO SUMMARY_OBJ
 *   }
 *
 */
router.get('/:id/summary', (req, res, next)=>{
  Summary.findByCaseId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
