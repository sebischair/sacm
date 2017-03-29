var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  [1,2,3].map(n => n + 1);
  res.send('respond with a resource');
});

module.exports = router;
