import express from 'express';
import GitAnalytics from './../analytics/GitAnalytics';
import ExcelAnalytics from './../analytics/ExcelAnalytics';
const router = express.Router();


/**
 * @api {get} /analytics/repository
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiSampleRequest /analytics
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/repository/all', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  GitAnalytics.analyzeRepositoryAll()
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /analytics/repository
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiSampleRequest /analytics
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/repository/files', (req, res, next)=>{
  res.connection.setTimeout(100*60*1000);
  GitAnalytics.analyzeRepositoryFiles()
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /analytics/file
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiSampleRequest /analytics
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/file', (req, res, next)=>{
  console.log('h')
  res.connection.setTimeout(100*60*1000);
  GitAnalytics.tryToAnalyzeFile()
    .then(c=>{
      console.log('hr')
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /analytics/postprocessing
 * @apiName GetAnalyticsPostprocessing
 * @apiGroup Analytics
 * @apiSampleRequest /analytics/postprocessing
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/postprocessing', (req, res, next)=>{
  console.log('h1')
  res.connection.setTimeout(100*60*1000);
  new ExcelAnalytics().postAnalytics()
    .then(c=>{
      console.log('hr1')
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
