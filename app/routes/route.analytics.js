import express from 'express';
import ModelAnalytics from './../analytics/ModelAnalytics';
const router = express.Router();


/**
 * @api {get} /analytics
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiSampleRequest /analytics
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/', (req, res, next)=>{
  ModelAnalytics.analyze()
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
