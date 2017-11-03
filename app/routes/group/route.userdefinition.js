import express from 'express';
import UserDefinition from './../../models/group/model.userdefinition'
const router = express.Router();


/**
 * @api {get} /userdefinitions Get User Definition
 * @apiName GetUserDefinitions
 * @apiGroup UserDefinition
 * @apiSampleRequest /userdefinitions
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.get('/', (req, res, next)=>{
  UserDefinition.find(req.jwt)
    .then(userDefinition=>{
        res.status(200).send(userDefinition);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
