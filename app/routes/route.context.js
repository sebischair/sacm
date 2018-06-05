import express from 'express';
import Context from './../models/model.context';
const router = express.Router();


/**
 * @api {get} /context
 * @apiName GetContext
 * @apiGroup Context
 * @apiSampleRequest /context
 * @apiSuccessExample {json} Success-Response:
 *  {}
 */
router.get('/', (req, res, next)=>{
  Context.info(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
