import express from 'express';
import Attribute from './../../models/case/model.attribute';
const router = express.Router();



/**
 * @api {get} /attribute/:id/autocomplete Get Attribute Autocomplete
 * @apiName AttributeAutocomplete
 * @apiGroup Attribute
 * @apiParam {String} id ID of the Attribute
 * @apiSampleRequest /attribute/:id/autocomplete
 * @apiSuccessExample {json} Success-Response:
 *
 */
router.get('/:id/autocomplete', (req, res, next)=>{
  Attribute.autocompleteById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});




module.exports = router;
