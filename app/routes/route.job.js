import express from 'express';
import Job from './../models/model.job';
const router = express.Router();


/**
 * @api {get} /jobs/completeon/trigger Tigger complete on with manual trigger
 * @apiName PostJobsCompleteonManualTrigger
 * @apiGroup Jobs
 * @apiSampleRequest /jobs/completeon/trigger
 * @apiSuccessExample {json} Success-Response:
 *  {}
 */
router.post('/completeon/trigger', (req, res, next)=>{
  Job.triggerCompleteOn(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
