var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('pages/login', { title: 'Express' });
});

router.get('/admin', function(req, res, next) {
  res.render('pages/admin', { title: 'Express' });
});

module.exports = router;
