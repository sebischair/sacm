import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next)=>{
  res.json('respond with a resource');
});

module.exports = router;