import express from 'express';

var router = express.Router();
import AutomatedTask from './../../models/case/model.automatedtask';

/**
 * @api {get} automatedtask/:id Get AutomatedTask
 * @apiName GetAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a AutomatedTask
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       TODO AUTOMATED_TASK_OBJ
 *     }
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTask.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




/**
 * TODO CHECK IF ROUTE EXISTS
 * @api {delete} automatedtask/:id Delete AutomatedTask
 * @apiName DeleteAutomatedTask
 * @apiGroup AutomatedTask
 *
 * @apiParam {Number} id Unique ID of a CaseDefinition.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       TODO AUTOMATED_TASK_OBJ
 *     }
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTask.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
