import express from 'express';
import winston from 'winston/lib/winston';
import GitAnalytics from './../analytics/GitAnalytics';
import ExcelAnalytics from './../analytics/ExcelAnalytics';
import LogMigrator from './../logging/LogMigrator';
const router = express.Router();

let timestamp = Date.now();

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

/**
 * @api {get} /analytics/logs/migrate
 * @apiName MigrateRestLogs
 * @apiGroup Analytics
 * @apiSampleRequest /analytics/logs/migrate
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/logs/migrate', (req, res, next) => {
  res.connection.setTimeout(100 * 60 * 1000);
  const givenTimestamp = req.query.timestamp;
  const skip = isNaN(req.query.skip) ? 0 : parseInt(req.query.skip);
  const limit = isNaN(req.query.limit) ? 10000 : parseInt(req.query.limit);
  new LogMigrator(timestamp).mongooseToSequelize(givenTimestamp, skip, limit)
    .then(message => {
      res.status(200).send(message);
    })
    .catch(err => {
      winston.error(err);
      res.status(500).send(err);
    });
  timestamp += 1;
});

module.exports = router;
