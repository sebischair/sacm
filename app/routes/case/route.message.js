import express from 'express';
import Message from './../../models/case/model.message';
const router = express.Router();


/**
 * @api {get} /messages/me/unseen My unseen Messages
 * @apiName MyUnseenMessages
 * @apiGroup Messages
 * @apiSampleRequest /messages/me/unseen
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.get('/me/unseen', (req, res, next)=>{
  Message.findMeUnseen(req.jwt)
    .then(c=>{
        res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

/**
 * @api {post} /messages/me/seen Mark as seen Messages
 * @apiName MySeenMessages
 * @apiGroup Messages
 * @apiSampleRequest /messages/me/seen
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/me/seen', (req, res, next)=>{
  Message.seenByMe(req.jwt)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

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
 * @api {post} /messages/:id/seen Create Message
 * @apiName CreateMessage
 * @apiGroup Messages
 * @apiParam {String} case ID of the case
 * @apiParam {String} text Content of the message
 * @apiSampleRequest /messages/:id/seen
 * @apiSuccessExample {json} Success-Response:
 *   {}
 */
router.post('/:id/seen', (req, res, next)=>{
  Message.seen(req.jwt, req.params.id)
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
