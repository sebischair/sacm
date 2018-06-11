import express from 'express';
import Context from './../models/model.context';
const router = express.Router();


/**
 * @api {get} /context
 * @apiName GetContext
 * @apiGroup Context
 * @apiSampleRequest /context
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "isProductionMode": true,
 *     "apiVersions": [
 *         "v1"
 *     ],
 *     "backendVersion": {
 *         "dockertag": "latest",
 *         "buildcommit": "eb8214baf62538c15349d20b0841104af90e278a",
 *         "builddate": "2018-06-05T16:20:11+02:00"
 *     },
 *     "initializationTimeStamp": "2018-06-05T14:24:20.274"
 * }
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
