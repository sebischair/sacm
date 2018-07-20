import express from 'express';
import ModelAnalytics from './../analytics/ModelAnalytics';
const router = express.Router();


/**
 * @api {get} /analytics/repository
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiSampleRequest /analytics
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/repository', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  ModelAnalytics.analyzeRepository()
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

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
