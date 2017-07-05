import express from 'express';
import TaskParam from './../../models/case/model.taskparam';
const router = express.Router();


/**
 * @api {get} /taskparams/:id/autocomplete Get TaskParam Autocomplete
 * @apiName TaskParamAutocomplete
 * @apiGroup TaskParam
 * @apiParam {String} id ID of the TaskParam
 * @apiSampleRequest /taskparams/:id/autocomplete
 * @apiSuccessExample {json} Success-Response:
 * {}
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
