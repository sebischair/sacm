import express from 'express';

var router = express.Router();

// Models
import TaskParam from './../../models/case/model.taskparam';



/**
 * @api {get} /taskparam/:id/autocomplete Get TaskParam Autocomplete
 *
 * @apiName TaskParamAutocomplete
 * @apiGroup TaskParam
 *
 * @apiParam {String} id ID of the TaskParam
 *
 * @apiSampleRequest /taskparam/:id/autocomplete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
router.get('/:id/autocomplete', (req, res, next)=>{
  TaskParam.autocompleteById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
