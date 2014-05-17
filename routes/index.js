var router = require('express').Router(),
    Application = require('../models/Application');

router.post('/requests/:app_id', function(req, res) {

});

router.get('/', function(req, res) {
  res.render('apps/index');
});

router.get('/apps/new', function(req, res) {
  res.render('apps/new');
});

router.post('/apps/new', function(req, res) {
});


module.exports = router;