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
 *    id: "44hrafd34dsc",
 *    case: "7fhr63734sd",
 *    text: "Attention!"
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
 *  {
 *  	"process": "1rjdqzyu6ser9",
 *  	"creationDate": "2017-06-12 13:58:56.0",
 *  	"expireDate": "2017-06-14 13:52:12.0",
 *  	"text": "Alert Message",
 *  	"data": {
 *  		"alertType": "some type",
 *  		"application": "Run App",
 *  		"priorityLevel": "LOW",
 *  		"status": "ACT",
 *  		"paramName": "steps per day",
 *  		"paramValue": "12",
 *  		"minThreshold": "5",
 *  		"maxThreshold": "8"
 *  	}
 *  }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *  	"id": "jdddqzyu6ser7",
 *    "process": "1rjdqzyu6ser9",
 *  	"creationDate": "2017-06-12 13:58:56.0",
 *  	"expireDate": "2017-06-14 13:52:12.0",
 *  	"text": "Alert Message",
 *  	"data": {
 *  		"alertType": "some type",
 *  		"application": "Run App",
 *  		"priorityLevel": "LOW",
 *  		"status": "ACT",
 *  		"paramName": "steps per day",
 *  		"paramValue": "12",
 *  		"minThreshold": "5",
 *  		"maxThreshold": "8"
 *  	}
 *    "seenDate": null
 *  }
 */
router.post('/', (req, res, next)=>{
  var data =  req.body;
  Alert.create(data)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {post} /alert Update Alert
 *
 * @apiName UpdateAlert
 * @apiGroup Alert
 *
 * @apiParam {String} process ID of the process
 * @apiParam {String} text Text content of the message
 *
 * @apiSampleRequest /alert
 *  {
 *  	"process": "1rjdqzyu6ser9",
 *  	"creationDate": "2017-06-12 13:58:56.0",
 *  	"expireDate": "2017-06-14 13:52:12.0",
 *  	"text": "Alert Message",
 *  	"data": {
 *  		"alertType": "some type",
 *  		"application": "Run App",
 *  		"priorityLevel": "LOW",
 *  		"status": "ACT",
 *  		"paramName": "steps per day",
 *  		"paramValue": "12",
 *  		"minThreshold": "5",
 *  		"maxThreshold": "8"
 *  	}
 *  }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *  	"id": "jdddqzyu6ser7",
 *    "process": "1rjdqzyu6ser9",
 *  	"creationDate": "2017-06-12 13:58:56.0",
 *  	"expireDate": "2017-06-14 13:52:12.0",
 *  	"text": "Alert Message",
 *  	"data": {
 *  		"alertType": "some type",
 *  		"application": "Run App",
 *  		"priorityLevel": "LOW",
 *  		"status": "ACT",
 *  		"paramName": "steps per day",
 *  		"paramValue": "12",
 *  		"minThreshold": "5",
 *  		"maxThreshold": "8"
 *  	}
 *    "seenDate": null
 *  }
 */
router.patch('/:id', (req, res, next)=>{
  var data =  req.body;
  data.id = req.params.id;
  Alert.updateById(data)
    .then(a=>{
      res.status(200).send(a);
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
 *   {}
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
