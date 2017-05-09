import express from 'express';
var router = express.Router();
import AutomatedTaskDefinition from './../../models/casedefinition/model.automatedtaskdefinition';
import AutomatedTask from './../../models/case/model.automatedtask';

/**
 * @api {get} /automatedtaskdefinition/:id Get AutomatedTaskDefinition
 *
 * @apiName GetAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "label": "asdasdasd",
 *     "type": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /automatedtaskdefinition/:id Delete AutomatedTaskDefinition
 *
 * @apiName DeleteAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 *
 * @apiSampleRequest /automatedtaskdefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  AutomatedTaskDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /automatedtaskdefinitions Create AutomatedTaskDefinition
 *
 * @apiName CreateAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /automatedtaskdefinitions
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "label": "asdasdasd",
 *     "type": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 *
 */
router.post('/', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: req.body.label,
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
 AutomatedTaskDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});



/**
 * @api {patch} /automatedtaskdefinition/:id Update AutomatedTaskDefinition
 *
 * @apiName UpdateAutomatedTaskDefinition
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /automatedtaskdefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     "isRepeatable": "true",
 *     "newEntityDefinition": null,
 *     "name": "stageDef_1",
 *     "sentryDefinitions": [],
 *     "hookDefinitions": [],
 *     "id": "1c8579tlziu8t",
 *     "label": "asdasdasd",
 *     "type": "StageDefinition",
 *     "isMandatory": "true",
 *     "newEntityAttachPath": null,
 *     "caseDefinition": "1v77wsi7jdky8",
 *     "parentStageDefinition": null
 *   }
 *
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    caseDefinition: req.body.caseDefinition,
    name: req.body.name,
    label: req.body.label,
    isRepeatable: req.body.isRepeatable,
    isMandatory: req.body.isMandatory,
    parent: req.body.parent,
    preconditions: req.body.preconditions
  }
  AutomatedTaskDefinition.updateById(data)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /automatedtaskdefinition/:id/automatedtasks Get AutomatedTasks
 *
 * @apiName GetAutomatedTasks
 * @apiGroup AutomatedTaskDefinition
 *
 * @apiParam {String} id ID of the AutomatedTaskDefinition
 *
 * @apiSampleRequest /automatedtaskdefinition/:id/automatedtasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *      TODO AUTOMATED_TASK_OBJ
 *   }
 *
 */
router.get('/:id/automatedtasks', (req, res, next)=>{
  AutomatedTask.findbyTaskDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
