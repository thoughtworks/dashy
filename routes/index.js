var Application = require('../models/Application');
var router = require('express').Router();

router.get('/', function(req, res) {
  Application.find(function (err, apps) {
    res.render('applications/index', {
      apps: apps
    });
  });
});

router.post('/requests/:app_key', function(req, res) {
  var appKey = req.params.app_key;

  Application.findOne({key: appKey}, function (err, app) {
    if(app) {
      app.requests.push(req.body.request);
      app.save(function (err, a) {
        res.send('Success');
      });
    }
    else {
      res.send('Invalid application key. Please make sure the given key is correct.');
    }
  });
});

router.get('/applications/new', function (req, res) {
  res.render('applications/new');
});

router.post('/applications/new', function (req, res) {
  new Application(req.body.application).save(function (err, app) {
    if(err) {
      res.render('applications/new', {
        application: req.body.application,
        error: err
      });
    }

    res.redirect('/');
  });
});

module.exports = router;
