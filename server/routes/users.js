import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next)=>{
  [1,2,3].map(n => n + 1);
  res.send('respond with a resource');
});

module.exports = router;
