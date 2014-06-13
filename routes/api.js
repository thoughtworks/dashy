var router = require('express').Router(),
  Application = require('../models/application');

module.exports = function(io) {

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
      res.send(400, {error: 'Empty data.'});
      return;
    }
    
    if(data.endpoint === undefined || data.success === undefined) {
      res.send(400, {error: 'Invalid data.'})
      return;
    }

    Application.findOne({key: appKey}, function (err, app) {      
      if(!app || err) {
        res.send(400, {error:'Invalid application key. Please make sure the given key is correct.'});
        return;
      }

      var environment = data.environment || 'Default';

      app.requests = app.requests || {};
      app.requests[data.endpoint] = app.requests[data.endpoint] || [];

      var newRequest = {
        success: toBool(data.success),
        date: new Date(),
        environment: data.environment
      };
      app.requests[data.endpoint].push(newRequest);

      io && io.sockets.emit('newRequest', {
        appName: app.name,
        environment: environment,
        endpoint: data.endpoint,
        request: newRequest
      });

      Application.update({key: appKey}, {requests: app.requests}, function (err, numberAffected, raw) {
        res.send(200);
      });
    });
  });

  router.post('/applications/new', function (req, res) {
    var application = req.body.application;
    if (!application.name) {
      res.send(400, {error: 'Name is required.'})
    }
    new Application(application).save(function (err, app) {
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
  return router;
}