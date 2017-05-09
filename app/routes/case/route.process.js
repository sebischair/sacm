import express from 'express';

var router = express.Router();
import Process from './../../models/case/model.process';
import Alert from './../../models/case/model.alert';

/**
 * @api {get} /process/:id Get Process
 *
 * @apiName GetProcess
 * @apiGroup Process
 *
 * @apiParam {String} id ID of the Process
 *
 * @apiSampleRequest /process/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO PROCESS_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Process.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /process/:id/alerts Get Process alerts
 *
 * @apiName GetProcessAlerts
 * @apiGroup Process
 *
 * @apiParam {String} id ID of the Process
 *
 * @apiSampleRequest /process/:id/alerts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO ALERT_OBJ
 *   }
 *
 */
router.get('/:id/alerts', (req, res, next)=>{
  Alert.findByProcessId(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
