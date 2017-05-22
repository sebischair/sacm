import express from 'express';

var router = express.Router();

// Models
import Group from './../../models/case/model.group'



/**
 * @api {get} /task/:id Get Task
 *
 * @apiName GetTask
 * @apiGroup Task
 *
 * @apiParam {String} id ID of the Task
 *
 * @apiSampleRequest /task/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     //  Automated or HumanTasks
 *     {
 *          "processDefinition": "bq1iuo0uuzo9",
 *          "id": "p503h6ephfqv",
 *          "parentStage": "10kx8cvxs3t0w",
 *          "sentries": [],
 *          "stateDates": {
 *            "enabled": "2017-05-15 17:29:18.0",
 *            "terminated": null,
 *            "active": null,
 *            "available": "2017-05-15 17:29:17.0",
 *            "completed": null
 *          },
 *          "taskParams": [],
 *          "description": "Lace",
 *          "name": "Lace",
 *          "owner": null,
 *          "state": "ENABLED",
 *          "case": "1q7nud4e2v1dl",
 *          "resourceType": "AutomatedTask"
 *     }
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

router.post('/', (req, res, next)=>{
  const data = req.body;
  data.id = req.params.id;
  Group.create(data)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  Group.findById(req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

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


router.del('/:id', (req, res, next)=>{
  Group.deleteById(req.params.id)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.post('/:id/member/:principalId', (req, res, next)=>{
  Group.addMember(req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.del('/:id/member/:principalId', (req, res, next)=>{
  Group.delMember(req.params.id, req.params.principalId)
    .then(group=>{
        res.status(200).send(group);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
