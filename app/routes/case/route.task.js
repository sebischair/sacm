import express from 'express';

var router = express.Router();

// Models
import Task from './../../models/case/model.task'



/**
 * @api {get} /task/:id Get Task
 *
 * @apiName GetTask
 * @apiGroup Task
 *
 * @apiParam {String} id ID of the Task
 *
 * @apiSampleRequest /task/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO TASK_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Task.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
