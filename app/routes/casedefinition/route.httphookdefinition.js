import express from 'express';
import HttpHookDefinition from './../../models/casedefinition/model.httphookdefinition'
const router = express.Router();

/**
 * @api {get} /httphookdefinition/:id Get HttpHookDefinition
 * @apiName GetHttpHookDefinition
 * @apiGroup HttpHookDefinition
 * @apiParam {String} id ID of the HttpHookDefinition
 * @apiSampleRequest test
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     id: "hdze783ncv"
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi",
 *     resourceType: "HttpHookDefinition"
 *   }
 */
router.get('/:id', (req, res, next)=>{
  HttpHookDefinition.findById(req.jwt, req.params.id)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /httphookdefinition Create HttpHookDefinition
 * @apiName CreateHttpHookDefinition
 * @apiGroup HttpHookDefinition
 * @apiParam {String} on State on which the Hook is invoked
 * @apiParam {String} url URL of the Hook endpoint
 * @apiParam {String} method Request method of the Hook
 * @apiParam {String} processDefinition ID of the ProcessDefinition
 * @apiSampleRequest /httphookdefinition
 *   {
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     id: "i938uejh378",
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }
 */
router.post('/', (req, res, next)=>{
  HttpHookDefinition.create(req.jwt, req.body)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /httphookdefinition/:id Update HttpHookDefinition
 * @apiName UpdateHttpHookDefinition
 * @apiGroup HttpHookDefinition
 * @apiParam {String} id ID of the HttpHookDefinition
 * @apiSampleRequest /httphookdefinition/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     id: "i938uejh378",
 *     on: "AVAILABLE",
 *     url: "http://example.com",
 *     method: "GET",
 *     processDefinition: "hka51pgpkgbi"
 *   }
 */
router.patch('/:id', (req, res, next)=>{
  HttpHookDefinition.updateById(req.jwt, req.body)
    .then(sd=>{
        res.status(200).send(sd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {delete} /httphookdefinition/:id Delete HttpHookDefinition
 * @apiName DeleteHttpHookDefinition
 * @apiGroup HttpHookDefinition
 * @apiParam {String} id ID of the HttpHookDefinition
 * @apiSampleRequest test
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.delete('/:id', (req, res, next)=>{
  HttpHookDefinition.deleteById(req.jwt, req.params.id)
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
