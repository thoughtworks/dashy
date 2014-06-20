var router = require('express').Router(),
  _ = require('underscore'),
  Application = require('../models/application');

module.exports = function() {

  router.get('/', function(req, res){
    Application.find().sort({name: 1}).exec(function (err, apps) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, apps);
    });
  });

  router.post('/', function (req, res) {
    var application = req.body.application;
    if (!application.name) {
      res.send(400, {error: 'Name is required.'})
    }
    new Application(application).save(function (err, app) {
      if(err) {
        res.send(500, err);
        return;
      }
      res.send(200, app);
    });
  });

  return router;
}