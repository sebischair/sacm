import express from 'express';

var router = express.Router();

// Models
import Alert from './../../models/case/model.alert';

/**
 * @api {get} /alert/:id Get Alert
 *
 * @apiName GetAlert
 * @apiGroup Alert
 *
 * @apiParam {String} id ID of the Alert
 *
 * @apiSampleRequest /alert/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO ALERT_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Alert.findById(req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /alert Create Alert
 *
 * @apiName CreateAlert
 * @apiGroup Alert
 *
 * @apiParam {String} process ID of the process
 * @apiParam {String} text Text content of the message
 *
 * @apiSampleRequest /alert
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *    case: "7fhr63734sd",
 *    text: "Attention!"
 *   }
 *
 */
router.post('/:id', (req, res, next)=>{
  var data = {
    case: req.body.case,
    text: req.body.text
  }
  Alert.create(data)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /alert/:id/seen Set Status
 *
 * @apiName SetAlertSeenStatus
 * @apiGroup Alert
 *
 * @apiParam {String} id ID of the Alert
 *
 * @apiSampleRequest /alert/:id/seen
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *   }
 *
 */
router.post('/:id/seen', (req, res, next)=>{
  Alert.seen(req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;