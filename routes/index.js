var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:page', function(req, res, next) {
  var page = req.params.page;
  res.render(page, null);
});

module.exports = router;
