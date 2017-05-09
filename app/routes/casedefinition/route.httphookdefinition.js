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
 * @api {patch} /httphookdefinition Create HttpHookDefinition
 *
 * @apiName CreateHttpHookDefinition
 * @apiGroup HttpHookDefinition
 *
 * @apiParam {String} on State on which the Hook is invoked
 * @apiParam {String} url URL of the Hook endpoint
 * @apiParam {String} method Request method of the Hook
 * @apiParam {String} processDefinition ID of the ProcessDefinition
 *
 * @apiSampleRequest /httphookdefinition
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }
 *
 */
router.post('/', (req, res, next)=>{
  var data = {
    on: req.body.on,
    url: req.body.url,
    method: req.body.method,
    processDefinition: req.body.processDefinition
  }
  HttpHookDefinition.create(data)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /httphookdefinition/:id Update HttpHookDefinition
 *
 * @apiName UpdateHttpHookDefinition
 * @apiGroup HttpHookDefinition
 *
 * @apiParam {String} id ID of the HttpHookDefinition
 *
 * @apiSampleRequest /httphookdefinition/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }
 *
 */
router.patch('/:id', (req, res, next)=>{
  var data = {
    on: req.body.on,
    url: req.body.url,
    method: req.body.method,
    processDefinition: req.body.processDefinition
  }
  HttpHookDefinition.updateById(data)
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
