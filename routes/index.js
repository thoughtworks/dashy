var Application = require('../models/Application');
var router = require('express').Router();

router.get('/', function(req, res) {
  Application.find().sort({name: -1}).exec(function (err, apps) {
    if(apps.length > 0) {
      res.render('applications/index', {
        apps: apps
      });
    }
    else {
      res.redirect('/applications/new');
    }
  });
});

router.post('/requests/:app_key', function(req, res) {
  var appKey = req.params.app_key;

  Application.findOne({key: appKey}, function (err, app) {
    if(app) {
      var data = req.body.request;
      app.requests = app.requests || {};
      app.requests[data.environment] = app.requests[data.environment] || {};
      app.requests[data.environment][data.endpoint] = app.requests[data.environment][data.endpoint] || [];

      app.requests[data.environment][data.endpoint].push({
        success: data.success,
        date: new Date()
      });

      Application.update({key: appKey}, {requests: app.requests}, function (err, app) {
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
