import express from 'express';

var router = express.Router();

// Models
import User from './../../models/case/model.user'
import Case from './../../models/case/model.case'


/**
 * @api {get} /users Get Users of Workspace
 *
 * @apiName GetUsers
 * @apiGroup User
 *
 *
 * @apiSampleRequest /users
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *         {
 *          "id": "10dsnh0e84zx3",
 *          "name": "JohnSmith"
 *        },
 *        {
 *          "id": "18424r0bvx0qq",
 *          "name": "PhilipBarnes"
 *         }, ...
 *     ]
 *
 */
router.get('/', (req, res, next)=>{
  User.findAll()
    .then(users=>{
        res.status(200).send(users);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /user/:id Get Users By ID
 *
 * @apiName GetUserByID
 * @apiGroup User
 *
 * @apiParam {String} id ID of the User
 *
 * @apiSampleRequest /user/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "isVerified": true,
 *      "lastLoginDate": "2017-05-22 08:09:39.0",
 *      "locale": "de-DE",
 *      "mayCreateWorkspace": true,
 *      "mayCreateGroup": true,
 *      "id": "10dsnh0e84zx3",
 *      "versions": [
 *        {
 *          "action": "Added",
 *          "date": "2017-05-22T08:09:34.399Z",
 *          "type": "_new",
 *          "user": {
 *            "id": "oi6l6vdha6vs",
 *            "name": "Max Mustermann"
 *          }
 *        }
 *      ],
 *      "email": "john.smith@connecare.eu",
 *      "name": "JohnSmith",
 *      "attributes": [],
 *      "mayEdit": false,
 *      "isAdministrator": false,
 *      "mayCreateUser": true,
 *      "groups": [
 *        {
 *          "id": "qj7erd93norx",
 *          "name": "Membership of JohnSmith in Barcelona-Nurses"
 *        }
 *      ]
 *    }
 *
 */
router.get('/:id', (req, res, next)=>{
  User.findById(req.params.id)
    .then(user=>{
        res.status(200).send(user);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /users Create User
 *
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} name Name of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} id ID of the User (must be unique, max. 32 chars)
 * @apiParam {String} attributes (optional) Custom attributes for the user
 *
 * @apiSampleRequest /users
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "isVerified": true,
 *       "lastLoginDate": "2017-05-22 08:32:16.0",
 *       "locale": "de-DE",
 *       "mayCreateWorkspace": true,
 *       "mayCreateGroup": true,
 *       "id": "oi6l6vdha6vs",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T08:01:36.687Z",
 *           "type": "_new"
 *         }
 *       ],
 *       "email": "mustermann@test.sc",
 *       "name": "Max Mustermann",
 *       "attributes": [],
 *       "mayEdit": true,
 *       "isAdministrator": true,
 *       "mayCreateUser": true,
 *       "groups": []
 *     }
 *
 */
router.post('/', (req, res, next)=>{
  User.createAndVerify(req.body)
    .then(user=>{
        res.status(200).send(user);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
});


/**
 * @api {delete} /user/:id Delete User by ID
 *
 * @apiName DeleteUserByID
 * @apiGroup User
 *
 * @apiParam {String} id ID of the User
 *
 * @apiSampleRequest /user/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 */
router.delete('/:id', (req, res, next)=>{
  User.deleteById(req.params.id)
    .then(user=>{
        res.status(200).send(user);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /user/:id Update User
 *
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} id ID of the user
 * @apiParam {String} name (optional) Name of the user
 * @apiParam {String} login (optional) Email of the user
 * @apiParam {String} attributes (optional) Custom attributes for the user
 *
 * @apiSampleRequest /user/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "isVerified": true,
 *       "lastLoginDate": "2017-05-22 08:32:16.0",
 *       "locale": "de-DE",
 *       "mayCreateWorkspace": true,
 *       "mayCreateGroup": true,
 *       "id": "oi6l6vdha6vs",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T08:01:36.687Z",
 *           "type": "_new"
 *         }
 *       ],
 *       "email": "mustermann@test.sc",
 *       "name": "Max Mustermann",
 *       "attributes": [],
 *       "mayEdit": true,
 *       "isAdministrator": true,
 *       "mayCreateUser": true,
 *       "groups": []
 *     }
 *
 */
router.patch('/:id', (req, res, next)=>{
  const data = req.body;
  data.id = req.params.id;
  User.updateById(data)
    .then(user=>{
        res.status(200).send(user);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /user/me Get own user data
 *
 * @apiName GetOwnUser
 * @apiGroup User
 *
 *
 * @apiSampleRequest /user/me
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "isVerified": true,
 *       "lastLoginDate": "2017-05-22 08:32:16.0",
 *       "locale": "de-DE",
 *       "mayCreateWorkspace": true,
 *       "mayCreateGroup": true,
 *       "id": "oi6l6vdha6vs",
 *       "versions": [
 *         {
 *           "action": "Added",
 *           "date": "2017-05-22T08:01:36.687Z",
 *           "type": "_new"
 *         }
 *       ],
 *       "email": "mustermann@test.sc",
 *       "name": "Max Mustermann",
 *       "attributes": [
 *         {
 *           "id": "10h8zpnf0715q",
 *           "values": [],
 *           "name": "PatientNr",
 *         },
 *         {
 *           "id": "19t5xsdeoeeur",
 *           "values": [],
 *           "name": "Phone",
 *         },
 *         {
 *           "id": "1s8infgj0q8ru",
 *           "values": [],
 *           "name": "Mobile",
 *         },
 *         {
 *           "id": "1xfihqihqwmqe",
 *           "values": [],
 *           "name": "Lastname",
 *         },
 *         {
 *           "id": "3s9fn1lepslw",
 *           "values": [],
 *           "name": "Language",
 *         },
 *         {
 *           "id": "48qdjbzc64cf",
 *           "values": [],
 *           "name": "Birthdate",
 *         },
 *         {
 *           "id": "fkgl51objooa",
 *           "values": [],
 *           "name": "Firstname",
 *         }
 *       ],
 *       "mayEdit": true,
 *       "isAdministrator": true,
 *       "mayCreateUser": true,
 *       "groups": [
 *         {
 *           "id": "1ium3wqkh94pw",
 *           "name": "Membership of Max Mustermann in Administrators"
 *         }
 *       ]
 *     }
 *
 */
router.get('/me', (req, res, next)=>{
  User.me(req.params.id)
    .then(user=>{
        res.status(200).send(user);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


module.exports = router;
