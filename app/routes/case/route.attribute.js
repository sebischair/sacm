import express from 'express';

var router = express.Router();

// Models
import Attribute from './../../models/case/model.attribute';



/**
 * @api {get} /attribute/:id/autocomplete Get Attribute Autocomplete
 *
 * @apiName AttributeAutocomplete
 * @apiGroup Attribute
 *
 * @apiParam {String} id ID of the Attribute
 *
 * @apiSampleRequest /attribute/:id/autocomplete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
