import express from 'express';
import Alert from './../../models/case/model.alert';
const router = express.Router();


/**
 * @api {get} /alerts/me Get My Alerts
 * @apiName GetMyAlerts
 * @apiGroup Alerts
 * @apiSampleRequest /alerts/me
 * @apiSuccessExample {json} Success-Response:
 *  [{
 *  	"id": "jdddqzyu6ser7",
 *  	"case": "2rddqzyu6der9",
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
 *  	"resourceType": "alerts"
 *  }]
 */
router.get('/me', (req, res, next)=>{
  Alert.findByMe(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {get} /alerts/:id Get Alert
 * @apiName GetAlert
 * @apiGroup Alerts
 * @apiParam {String} id (mandatory) ID of the Alert
 * @apiSampleRequest /alerts/:id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  	"id": "jdddqzyu6ser7",
 *  	"process": "1rjdqzyu6ser9",
 *  	"case": "2rddqzyu6der9",
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
 *  	"resourceType": "alerts"
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
 * @api {post} /alerts Create Alert 
 * @apiName CreateAlert
 * @apiGroup Alerts
 * @apiParam {String} process (mandatory) ID of the process
 * @apiParam {Date} creationDate (optional) Date when alert occured
 * @apiParam {Date} seenDate (optional) Date when alert was marked as seen
 * @apiParam {Date} expireDate (optional) Date when alert is expired
 * @apiParam {String} text (optional) Text content of the message
 * @apiParam {JSON} data (optional) Text content of the message 
 * @apiSampleRequest /alerts
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
 *  	"case": "2rddqzyu6der9",
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
 *  	"resourceType": "alerts"
 *  }
 */
router.post('/', (req, res, next)=>{
  Alert.create(req.jwt, req.body)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {patch} /alerts/:id Update Alert
 * @apiName UpdateAlert
 * @apiGroup Alerts
 * @apiParam {String} process (mandatory) ID of the Alert
 * @apiParam {String} process (optional) ID of the process
 * @apiParam {Date} creationDate (optional) Date when alert occured
 * @apiParam {Date} seenDate (optional) Date when alert was marked as seen
 * @apiParam {Date} expireDate (optional) Date when alert is expired
 * @apiParam {String} text (optional) Text content of the message
 * @apiParam {JSON} data (optional) Text content of the message 
 * @apiSampleRequest /alerts/:id
 *  {
 *  	"process": "1rjdqzyu6ser9",
 *  	"case": "2rddqzyu6der9",
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
 *  	"case": "2rddqzyu6der9",
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
 *  	"resourceType": "alerts"
 *  }
 */
router.patch('/:id', (req, res, next)=>{
  let data =  req.body;
  data.id = req.params.id;
  Alert.updateById(req.jwt, data)
    .then(a=>{
      res.status(200).send(a);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /alerts/:id/seen Mark Alert as Seen
 * @apiName SetAlertSeenStatus
 * @apiGroup Alerts
 * @apiParam {String} id (mandatory) ID of the Alert
 * @apiSampleRequest /alerts/:id/seen
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  	"id": "jdddqzyu6ser7",
 *  	"process": "1rjdqzyu6ser9",
 *  	"case": "2rddqzyu6der9",
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
 *  	"resourceType": "alerts"
 *  }
 */
router.post('/:id/seen', (req, res, next)=>{
  Alert.seen(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
