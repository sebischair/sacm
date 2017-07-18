import express from 'express';
import Group from './../../models/group/model.group';
const router = express.Router();



/**
 * @api {get} /groups Get Groups of Workspace
 * @apiName GetGroupsOfWorkspace
 * @apiGroup Groups
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 *     [
 *        {
 *          "id": "1hl75qvuk4mt3",
 *          "name": "Leida-Nurses",
 *        },...
 *      ]
 */
router.get('/', (req, res, next)=>{
  Group.findAll(req.jwt)
    .then(groups=>{
        res.status(200).send(groups);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /groups Create Group
 * @apiName CreateGroup
 * @apiGroup Groups
 * @apiParam {String} name Name of the group
 * @apiParam {Array} administrators List of user ids
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "id": "1991r88lk5x9v",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T11:15:57.687Z",
 *           "resourceType""_new",
 *           "user": {
 *             "id": "oi6l6vdha6vs",
 *             "name": "Max Mustermann",
 *           }
 *         }
 *       ],
 *       "activeMembersCount": 0,
 *       "name": "Barcelona-Doctoras",
 *       "administrators": [
 *         {
 *           "id": "oi6l6vdha6vs",
 *           "name": "Max Mustermann",
 *         }
 *       ],
 *       "mayEdit": true,
 *       "members": []
 *     }
 */
router.post('/', (req, res, next)=>{
  Group.create(req.jwt, req.body)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /groups/:id Get Group by ID
 * @apiName GetGroupByID
 * @apiGroup Groups
 * @apiParam {String} id ID of the Group
 * @apiSampleRequest /groups/:id
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "id": "1hl75qvuk4mt3",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T08:11:19.252Z",
 *           "resourceType""_new",
 *           "user": {
 *             "id": "oi6l6vdha6vs",
 *             "name": "Max Mustermann",
 *           }
 *         }
 *       ],
 *       "activeMembersCount": 0,
 *       "name": "Leida-Nurses",
 *       "administrators": [
 *         {
 *           "id": "oi6l6vdha6vs",
 *           "name": "Max Mustermann",
 *         }
 *       ],
 *       "mayEdit": true,
 *       "members": []
 *     }
 */
router.get('/:id', (req, res, next)=>{
  Group.findById(req.jwt, req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /groups Update Group
 * @apiName UpdateGroup
 * @apiGroup Groups
 * @apiParam {String} id ID of the Group
 * @apiParam {String} name (optional) Name of the group
 * @apiParam {Array} administrators (optional) List of user ids
 * @apiSampleRequest /groups
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "id": "1991r88lk5x9v",
 *       "versions": [],
 *       "activeMembersCount": 0,
 *       "name": "Barcelona-Doctoras",
 *       "administrators": [],
 *       "mayEdit": true,
 *       "members": []
 *     }
 */
router.patch('/:id', (req, res, next)=>{
  const data = req.body;
  data.id = req.params.id;
  Group.updateById(req.jwt, data)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /groups/:id Delete Group by ID
 * @apiName DeleteGroupByID
 * @apiGroup Groups
 * @apiParam {String} id ID of the Group
 * @apiSampleRequest /groups/:id
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "success": true
 *     }
 */
router.delete('/:id', (req, res, next)=>{
  Group.deleteById(req.jwt, req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /groups/:id/member/:principalId Add user to group
 * @apiName AddUserToGroup
 * @apiGroup Groups
 * @apiParam {String} id ID of the Group
 * @apiParam {String} principalId ID of the User / Principal
 * @apiSampleRequest /groups/:id/member/:principalId
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "success": true
 *     }
 */
router.post('/:id/member/:principalId', (req, res, next)=>{
  Group.addMember(req.jwt, req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /groups/:id/member/:principalId Remove User from Group
 * @apiName RemoveUserFromGroup
 * @apiGroup Groups
 * @apiParam {String} id ID of the Group
 * @apiParam {String} principalId ID of the User / Principal
 * @apiSampleRequest /groups/:id/member/:principalId
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "success": true
 *     }
 */
router.delete('/:id/member/:principalId', (req, res, next)=>{
  Group.delMember(req.jwt, req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
