import express from 'express';

var router = express.Router();

// Models
import Message from './../../models/case/model.message';

/**
 * @api {get} /message/:id Get Message
 *
 * @apiName GetMessage
 * @apiGroup Message
 *
 * @apiParam {String} id ID of the Message
 *
 * @apiSampleRequest /message/:id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     TODO MESSAGE_OBJ
 *   }
 *
 */
router.get('/:id', (req, res, next)=>{
  Message.findById(req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /message Create Message
 *
 * @apiName CreateMessage
 * @apiGroup Message
 *
 * @apiParam {String} case ID of the case
 * @apiParam {String} text Content of the message
 *
 * @apiSampleRequest /message
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     case: "sdhd77348dcx",
 *     text: "Hello world!"
 *   }
 *
 */
router.post('/', (req, res, next)=>{
  var data = {
    case: req.body.case,
    text: req.body.text
  }
  Message.create(data)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});






module.exports = router;