import express from 'express';

var router = express.Router();
import HumanTask from './../../models/case/model.humantask';


/**
 * @api {get} humantask/:id Get HumanTask
 * @apiName GetHumanDefinition
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       TODO Human_TASK_OBJ
 *     }
 */
router.get('/:id', (req, res, next)=>{
  HumanTask.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} humantask/:id/terminate Terminate HumanTask
 * @apiName TerminateHumanTask
 * @apiGroup HumanTask
 *
 * @apiParam {Number} id Unique ID of a HumanTask
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.post('/:id', (req, res, next)=>{
  HumanTask.terminate(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});

module.exports = router;
