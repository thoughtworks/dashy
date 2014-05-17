var http = require('http');
var Parse = require('parse').Parse;
var router = require('express').Router();

Parse.initialize('DwLq3sNDDPLPLCLmM9aVu9PVvh7YA4xdPTsjQ99s', 'WtLhQgczgHeBNL0YP6d39F3gYfFoSX9VqRT5zJLB');

var Application = Parse.Object.extend('Application');
var Request = Parse.Object.extend('Request');
var AppQuery = new Parse.Query(Application);

router.post('/requests/:app_id', function(req, res) {
  var request = new Request();
  var appId = req.param.app_id;

  AppQuery.get(appId).then(function() {
    var data = req.body.request;
    request.save(data).then(function(newRequest) {
      res.send(newRequest);
    });

    data.application = new Application({id: appId});
  });
});

router.get('/', function(req, res) {
  res.render('apps/index', {
    host: req.get('host')
  });
});

router.get('/apps/new', function(req, res) {
  res.render('apps/new');
});

router.post('/apps/new', function(req, res) {
  var app = new Application();
  var data = req.body;
  data.key = generateUniqueKey();

  app.save(data, {
    success: function() {
      res.redirect('/');
    },
    error: function() {
      res.render('apps/new', req.body);
    }
  });
});


module.exports = router;

function generateUniqueKey() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toUpperCase();
}