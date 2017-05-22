import express from 'express';

var router = express.Router();

// Models
import Group from './../../models/casedefinition/model.group'



/**
 * @api {get} /groups Get Groups of Workspace
 *
 * @apiName GetGroupsOfWorkspace
 * @apiGroup Group
 *
 *
 * @apiSampleRequest /groups
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        {
 *          "id": "1hl75qvuk4mt3",
 *          "name": "Leida-Nurses",
 *          "href": "http://server.sociocortex.com/api/v1/groups/1hl75qvuk4mt3"
 *        },...
 *      ]
 *
 */
router.get('/', (req, res, next)=>{
  Group.findAll()
    .then(groups=>{
        res.status(200).send(groups);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /groups Create Group
 *
 * @apiName CreateGroup
 * @apiGroup Group
 *
 * @apiParam {String} name Name of the group
 * @apiParam {Array} administrators List of user ids
 *
 * @apiSampleRequest /groups
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "1991r88lk5x9v",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T11:15:57.687Z",
 *           "type": "_new",
 *           "user": {
 *             "id": "oi6l6vdha6vs",
 *             "name": "Max Mustermann",
 *             "href": "http://server.sociocortex.com/api/v1/users/oi6l6vdha6vs"
 *           }
 *         }
 *       ],
 *       "activeMembersCount": 0,
 *       "name": "Barcelona-Doctoras",
 *       "administrators": [
 *         {
 *           "id": "oi6l6vdha6vs",
 *           "name": "Max Mustermann",
 *           "href": "http://server.sociocortex.com/api/v1/users/oi6l6vdha6vs"
 *         }
 *       ],
 *       "mayEdit": true,
 *       "href": "http://server.sociocortex.com/api/v1/groups/1991r88lk5x9v",
 *       "members": []
 *     }
 *
 */
router.post('/', (req, res, next)=>{
  Group.create(req.body)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /group/:id Get Group by ID
 *
 * @apiName GetGroupByID
 * @apiGroup Group
 *
 * @apiParam {String} id ID of the Group
 *
 *
 * @apiSampleRequest /group/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "1hl75qvuk4mt3",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T08:11:19.252Z",
 *           "type": "_new",
 *           "user": {
 *             "id": "oi6l6vdha6vs",
 *             "name": "Max Mustermann",
 *             "href": "http://server.sociocortex.com/api/v1/users/oi6l6vdha6vs"
 *           }
 *         }
 *       ],
 *       "activeMembersCount": 0,
 *       "name": "Leida-Nurses",
 *       "administrators": [
 *         {
 *           "id": "oi6l6vdha6vs",
 *           "name": "Max Mustermann",
 *           "href": "http://server.sociocortex.com/api/v1/users/oi6l6vdha6vs"
 *         }
 *       ],
 *       "mayEdit": true,
 *       "href": "http://server.sociocortex.com/api/v1/groups/1hl75qvuk4mt3",
 *       "members": []
 *     }
 *
 */
router.get('/:id', (req, res, next)=>{
  Group.findById(req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /groups Update Group
 *
 * @apiName UpdateGroup
 * @apiGroup Group
 *
 * @apiParam {String} id ID of the Group
 * @apiParam {String} name (optional) Name of the group
 * @apiParam {Array} administrators (optional) List of user ids
 *
 * @apiSampleRequest /groups
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "1991r88lk5x9v",
 *       "versions": [],
 *       "activeMembersCount": 0,
 *       "name": "Barcelona-Doctoras",
 *       "administrators": [],
 *       "mayEdit": true,
 *       "href": "http://server.sociocortex.com/api/v1/groups/1991r88lk5x9v",
 *       "members": []
 *     }
 *
 */
router.patch('/:id', (req, res, next)=>{
  const data = req.body;
  data.id = req.params.id;
  Group.updateById(data)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {delete} /group/:id Delete Group by ID
 *
 * @apiName DeleteGroupByID
 * @apiGroup Group
 *
 * @apiParam {String} id ID of the Group
 *
 * @apiSampleRequest /group/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 */
router.delete('/:id', (req, res, next)=>{
  Group.deleteById(req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /group/:id/member/:principalId Add user to group
 *
 * @apiName AddUserToGroup
 * @apiGroup Group
 *
 * @apiParam {String} id ID of the Group
 * @apiParam {String} principalId ID of the User / Principal
 *
 * @apiSampleRequest /group/:id/member/:principalId
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 */
router.post('/:id/member/:principalId', (req, res, next)=>{
  Group.addMember(req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /group/:id/member/:principalId Remove User from Group
 *
 * @apiName RemoveUserFromGroup
 * @apiGroup Group
 *
 * @apiParam {String} id ID of the Group
 * @apiParam {String} principalId ID of the User / Principal
 *
 * @apiSampleRequest /group/:id/member/:principalId
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 */
router.delete('/:id/member/:principalId', (req, res, next)=>{
  Group.delMember(req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
