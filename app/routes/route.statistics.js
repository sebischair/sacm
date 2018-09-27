import express from 'express';
import Statistic from './../models/model.statistic';
const router = express.Router();


/**
 * @api {get} /statistics
 * @apiName GetStatistics
 * @apiGroup Statistic
 * @apiSampleRequest /statistic
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/', (req, res, next)=>{
  Statistic.info(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
