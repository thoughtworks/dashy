var Application = require('../models/Application');
var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('apps/index', {
    host: req.get('host')
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


module.exports = router;