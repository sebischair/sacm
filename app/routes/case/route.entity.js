import express from 'express';

var router = express.Router();

// Models
import Entity from './../../models/case/model.entity';

/**
 * @api {get} /entity/:id Get Entity
 *
 * @apiName GetEntity
 * @apiGroup Entity
 *
 * @apiParam {String} id ID of the Entity
 *
 * @apiSampleRequest /entity/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * TODO
 *
 */
router.get('/:id', (req, res, next)=>{
  Entity.findById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
