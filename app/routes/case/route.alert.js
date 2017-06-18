import express from 'express';
import Alert from './../../models/case/model.alert';
const router = express.Router();


/**
 * @api {get} /alert/:id Get Alert
 * @apiName GetAlert
 * @apiGroup Alert
 * @apiParam {String} id (mandatory) ID of the Alert
 * @apiSampleRequest /alert/:id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  	"id": "jdddqzyu6ser7",
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
 *  	"seenDate": null,
 *  	"resourceType": "Alert"
 *  }
 */
router.get('/:id', (req, res, next)=>{
  Alert.findById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /alert Create Alert 
 * @apiName CreateAlert
 * @apiGroup Alert
 * @apiParam {String} process (mandatory) ID of the process
 * @apiParam {Date} creationDate (optional) Date when alert occured
 * @apiParam {Date} seenDate (optional) Date when alert was marked as seen
 * @apiParam {Date} expireDate (optional) Date when alert is expired
 * @apiParam {String} text (optional) Text content of the message
 * @apiParam {JSON} data (optional) Text content of the message 
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
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  	"id": "jdddqzyu6ser7",
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
 *  	"seenDate": null,
 *  	"resourceType": "Alert"
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
 * @api {patch} /alert/:id Update Alert
 * @apiName UpdateAlert
 * @apiGroup Alert
 * @apiParam {String} process (mandatory) ID of the Alert
 * @apiParam {String} process (optional) ID of the process
 * @apiParam {Date} creationDate (optional) Date when alert occured
 * @apiParam {Date} seenDate (optional) Date when alert was marked as seen
 * @apiParam {Date} expireDate (optional) Date when alert is expired
 * @apiParam {String} text (optional) Text content of the message
 * @apiParam {JSON} data (optional) Text content of the message 
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
 *  {
 *  	"id": "jdddqzyu6ser7",
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
 *  	"seenDate": null,
 *  	"resourceType": "Alert"
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
 * @api {post} /alert/:id/seen Mark Alert as Seen
 * @apiName SetAlertSeenStatus
 * @apiGroup Alert
 * @apiParam {String} id (mandatory) ID of the Alert
 * @apiSampleRequest /alert/:id/seen
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  	"id": "jdddqzyu6ser7",
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
 *  	"seenDate": "2017-06-13 13:52:12.0",
 *  	"resourceType": "Alert"
 *  }
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
