var http = require('http');
require('../config/database');
var App = require('../app');

module.exports = {
  baseUrl: 'http://localhost:5555/',
  Request: Request,
  Application: require('../models/application'),
  cleanDb: cleanDb,
  initServer: initServer,
  closeServer: App.closeServer
};

function initServer() {
  var ok = false;

  runs(function () {
    process.env.PORT = 5555;
    App.startServer(function() {
      ok = true;
    });
  });

  waitsFor(function () {
    return ok;
  });
}

function cleanDb() {
  var clean;

  runs(function () {
    clean = false;

    Application.remove({}, function (err) {
      if(err)
        console.error(err);
      else
        clean = true;
    });
  });

  waitsFor(function () {
    return clean;
  });
}

function Request (opts) {
  var self = this;
  opts = opts || {};

  this.opts = {
    method: 'POST',
    host: 'localhost',
    port: 5555,
    path: opts.path,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  this.run = function (data, callback) {
    var req = http.request(self.opts, function(res) {
      var output = '';

      res.on('data', function (chunk) {
        output += chunk;
      });

      res.on('end', function() {
        callback(output);
      });
    });

    req.write(JSON.stringify(data));

    req.on('error', function(e) {
      console.log('> > > Problem with request: ' + e.message);
    });

    req.end();
  };
}