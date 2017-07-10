import express from 'express';
import Tenant from './../../models/group/model.tenant';
const router = express.Router();



/**
 * @api {get} /tenants/groups Get Groups of Tenants
 * @apiName GetGroupsOfWorkspace
 * @apiGroup Tenant
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/', (req, res, next)=>{
  Tenant.findAll(req.jwt)
    .then(groups=>{
        res.status(200).send(groups);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});





module.exports = router;
