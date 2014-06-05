var router = require('express').Router();
var Application = require('../models/application');

router.get('/myIndex', function(req, res){
  res.render('myIndex');
});
  
router.get('/apps', function(req, res){
  Application.find().sort({name: 1}).exec(function (err, apps) {
    if (!err) {
      res.send(apps);
    }
  });
});

router.post('/requests/:app_key', function(req, res) {
  var appKey = req.params.app_key;
  var data = req.body.request;

  if(!data) {
    res.send('Incorrect data.')
    return;
  }
  if(data.endpoint === undefined || data.success === undefined) {
    res.send('Incorrect data.')
    return;
  }

  Application.findOne({key: appKey}, function (err, app) {
    if(!app || err) {
      res.send('Invalid application key. Please make sure the given key is correct.');
      return;
    }

    var environment = data.environment || 'Default';

    app.requests = app.requests || {};
    app.requests[environment] = app.requests[environment] || {};
    app.requests[environment][data.endpoint] = app.requests[environment][data.endpoint] || [];

    var newRequest = {
      success: toBool(data.success),
      date: new Date()
    };
    app.requests[environment][data.endpoint].push(newRequest);

    socket && socket.emit('newRequest', {
      appName: app.name,
      environment: environment,
      endpoint: data.endpoint,
      request: newRequest
    });

    Application.update({key: appKey}, {requests: app.requests}, function (err, numberAffected, raw) {
      res.send('Success');
    });
  });
});

router.post('/applications/new', function (req, res) {
  new Application(req.body.application).save(function (err, app) {
    if(err) {
      res.send(err);
    }
    res.send(200);
  });
});

function toBool(value) {
  if(typeof value === 'string') {
    if(value === 'true') return true;
    else if(value === 'false') return false;
  }

  return value;
}
module.exports = router;