import express from 'express';

var router = express.Router();
import AutomatedTask from './../../models/case/model.automatedtask';

/**
 * @apiVersion 0.1.0
 * @api {get} casedefinition/:id/automatedtaskdefinitions Request all Automated Task Definitions of a CaseDefinition
 * @apiName GetAutomatedTaskDefinition
 * @apiGroup Tasks
 *
 * @apiParam {Number} id Unique ID of a CaseDefinition.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/', (req, res, next)=>{
  AutomatedTask.find({})
    .then(cs=>{
        res.status(200).send(cs);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @apiVersion 0.1.0
 * @api {get} /api/stagedefinition/:id/automatedtaskdefinitions Request all Automated Task Definitions of a StageDefinition
 * @apiName GetAutomatedTaskDefinitionsByStage
 * @apiGroup Tasks
 *
 * @apiParam {Object[]} id Unique ID of a StageDefinition.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": 4711
 *     }
 *
 * @apiSuccess {List} automated_task_definitions List of automated tasks
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
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
 * @apiVersion 0.1.0
 * @api {get} automatedtaskdefinition/:id Delete an Automated Task Definition by ID
 * @apiName DeleteAutomatedTaskDefinitionById
 * @apiGroup Tasks
 *
 * @apiParam {Number} id(optional) Unique ID of an AutomatedTaskDefinition.
 *
 * @apiSuccess {boolean} result Indicator if deletion was successfull
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTask.findById(req.params.id)
    .then(c=>{
        return c.remove();
    })
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @apiVersion 0.1.0
 * @api {post} automatedtaskdefinitions Creates a new Automated Task Definition
 * @apiName CreateAutomatedTaskDefinition
 * @apiGroup Tasks
 *
 * @apiParam {Number} id Unique ID of an AutomatedTaskDefinition.
 *
 * @apiSuccess {boolean} result Indicator if deletion was successfull
 */
router.post('/',  (req, res, next)=>{
    new AutomatedTask({
      name: 'test case'
    }).save().then(cc=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
);


module.exports = router;
