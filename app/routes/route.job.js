import express from 'express';
import Job from './../models/model.job';
const router = express.Router();


/**
 * @api {get} /jobs/completion/trigger Tigger complete on with manual trigger
 * @apiName PostJobsCompletionManualTrigger
 * @apiGroup Jobs
 * @apiSampleRequest /jobs/completion/trigger
 * @apiSuccessExample {json} Success-Response:
 *  {}
 */
router.post('/completion/trigger', (req, res, next)=>{
  Job.triggerCompleteOn(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
