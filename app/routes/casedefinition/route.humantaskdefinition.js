import express from 'express';
var router = express.Router();
import HumanTaskDefinition from './../../models/casedefinition/model.humantaskdefinition';
import HumanTask from './../../models/case/model.humantask';


/**
 * @api {get} /humantaskdefinition/:id Get HumanTaskDefinition
 *
 * @apiName GetHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id ID of the HumanTaskDefinition
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
  HumanTaskDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /humantaskdefinition/:id Delete HumanTaskDefinition
 *
 * @apiName Delete HumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id ID of the HumanTaskDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {}
 *
 */
router.delete('/:id', (req, res, next)=>{
  HumanTaskDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /humantaskdefinitions Create HumanTaskDefinition
 *
 * @apiName CreateHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} caseDefinition ID of the parent CaseDefinition
 * @apiParam {String} name Name of the StageDefinition (internal usage)
 * @apiParam {String} label Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory Indicator if the stage should be mandatory
 * @apiParam {String} parent ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions Array of preconditions for the stage
 *
 * @apiSampleRequest /humantaskdefinitions
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
 HumanTaskDefinition.create(data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


/**
 * @api {patch} /humantaskdefinition/:id Update HumanTaskDefinition
 *
 * @apiName UpdateHumanTaskDefinition
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id The ID of the HumanTaskDefinition
 * @apiParam {String} caseDefinition (optional) ID of the parent CaseDefinition
 * @apiParam {String} name (optional) Name of the StageDefinition (internal usage)
 * @apiParam {String} label (optional) Label of the StageDefinition
 * @apiParam {Boolean} isRepeatable (optional) Indicator if the stage should be repeatable
 * @apiParam {Boolean} isMandatory (optional) Indicator if the stage should be mandatory
 * @apiParam {String} parent (optional) ID of the parent stage (if there is one)
 * @apiParam {Array} preconditions (optional) Array of preconditions for the stage
 *
 * @apiSampleRequest /test
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
  HumanTaskDefinition.updateById(req.params.id, data).then(sd=>{
    res.status(200).send(sd);
  })
  .catch(err=>{
    res.status(500).send(err);
  });
});


/**
 * @api {get} /humantaskdefinition/:id/humantasks Get HumanTasks
 *
 * @apiName GetHumanTasks
 * @apiGroup HumanTaskDefinition
 *
 * @apiParam {String} id ID of the HumanTaskDefinition
 *
 * @apiSampleRequest /humantaskdefinition/:id/humantasks
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *      TODO HUMAN_TASK_OBJ
 *   }
 *
 */
router.get('/:id/humantasks', (req, res, next)=>{
  HumanTask.findbyTaskDefinitionId(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
