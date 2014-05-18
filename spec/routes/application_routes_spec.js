var http = require('http');
var App = require('../../app');

describe('/requests/:app_key', function () {
  var app;

  beforeEach(function() {
    app = undefined;
    initServer();

    runs(function() {
      new Application({name: 'The app'}).save(function(err, a) {
        app = a;
      });
    });

    waitsFor(function() {
      return app !== undefined;
    });
  });

  afterEach(function () {
    App.closeServer();
  });

  it('should validate if the app_key exists', function (done) {
    new Request().run({}, function (output) {
      expect(output).toEqual('Invalid application key. Please make sure the given key is correct.');
      done();
    });
  });

  it('should create a request for the application if the app_key exists', function(done) {
    var data = {
      request: {
        endpoint: 'Service',
        success: true
      }
    };

    new Request({key: app.key}).run(data, function (output) {
      expect(output).toEqual('Success');

      Application.findOne({key: app.key}, function(err, a) {
        expect(a.requests.length).toEqual(1);
        expect(a.requests[0].endpoint).toEqual(data.request.endpoint);
        expect(a.requests[0].success).toEqual(data.request.success);
        done();
      });
    });
  });

});


function Request (opts) {
  var self = this;
  opts = opts || {};

  this.opts = {
    method: 'POST',
    host: 'localhost',
    port: 5555,
    path: '/requests/' + (opts.key || 'invalid_key'),
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