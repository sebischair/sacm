import express from 'express';
import Message from './../../models/case/model.message';
const router = express.Router();



/**
 * @api {get} /messages/:id Get Message
 * @apiName GetMessage
 * @apiGroup Messages
 * @apiParam {String} id ID of the Message
 * @apiSampleRequest /messages/:id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     TODO MESSAGE_OBJ
 *   }
 */
router.get('/:id', (req, res, next)=>{
  Message.findById(req.jwt, req.params.id)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



/**
 * @api {post} /messages Create Message
 * @apiName CreateMessage
 * @apiGroup Messages
 * @apiParam {String} case ID of the case
 * @apiParam {String} text Content of the message
 * @apiSampleRequest /messages
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     case: "sdhd77348dcx",
 *     text: "Hello world!"
 *   }
 */
router.post('/', (req, res, next)=>{
  Message.create(req.jwt, req.body)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

module.exports = router;
