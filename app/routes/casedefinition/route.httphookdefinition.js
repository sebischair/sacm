import express from 'express';
var router = express.Router();
import HttpHookDefinition from './../../models/casedefinition/model.httphookdefinition'


/**
 * @api {get} /httphookdefinition/:id Get HttpHookDefinition
 *
 * @apiName GetHttpHookDefinition
 * @apiGroup HttpHookDefinition
 *
 * @apiParam {String} id ID of the HttpHookDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO HTTP_HOOk_DEF_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  HttpHookDefinition.findById(req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /httphookdefinition/:id Delete HttpHookDefinition
 *
 * @apiName DeleteHttpHookDefinition
 * @apiGroup HttpHookDefinition
 *
 * @apiParam {String} id ID of the HttpHookDefinition
 *
 * @apiSampleRequest test
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     
 *   }
 */
router.delete('/:id', (req, res, next)=>{
  HttpHookDefinition.deleteById(req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
