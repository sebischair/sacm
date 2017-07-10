import express from 'express';
import Tenant from './../../models/group/model.tenant';
const router = express.Router();


/**
 * @api {get} /tenants/:id/users Get Groups of Tenants
 * @apiName GetGroupsOfWorkspace
 * @apiGroup Tenant
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/users', (req, res, next)=>{
  Tenant.findUsersById(req.jwt, req.params.id)
    .then(groups=>{
        res.status(200).send(groups);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /tenants/:id/users Get Groups of Tenants
 * @apiName GetGroupsOfWorkspace
 * @apiGroup Tenant
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 * {}
 */
router.get('/:id/groups', (req, res, next)=>{
  Tenant.findGroupsById(req.jwt, req.params.id)
    .then(groups=>{
        res.status(200).send(groups);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /tenants Get Groups of Tenants
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
