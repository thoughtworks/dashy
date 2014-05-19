require('../config/database');

jasmine.getEnv().defaultTimeoutInterval = 1000;

module.exports = {
  Application: require('../models/application'),
  cleanDb: cleanDb,

  MockResponse: MockResponse,
  get: new Route().get,
  post: new Route().post
};

function Route () {
  var router = require('../routes/index')();
  var self = this;

  self.isGet = false;
  self.method = 'post';

  this.get = function (url, callback) {
    self.method = 'get';
    self.isGet = true;
    self.doRequest(url, callback);
  };

  this.post = function (url, data, callback) {
    self.doRequest(url, data, callback);
  };

  this.doRequest = function (url, data, callback) {
    if(self.isGet) {
      callback = data;
    }

    for(var i in router.stack) {
      var route = router.stack[i];

      if(route.regexp.test(url) && route.route.methods[self.method]) {
        var matches = url.match(route.regexp);
        var keys = {};

        for(var j = 0; j < route.keys.length; j++) {
          keys[route.keys[j].name] = matches[j+1];
        }

        for(var j in route.route.stack) {
          if(route.route.stack[j].method === self.method) {
            var res = new MockResponse();
            var req = new MockRequest(keys);

            if(!self.isGet) {
              req.body = data;
            }

            route.route.stack[j].handle(req, res);

            responseCalled();
            function responseCalled() {
              setTimeout(function() {
                if(res.called) {
                  callback();
                  return;
                }
                responseCalled();
              }, 10)
            }

          }
        }

        break;
      }
    }
  }
};

function MockResponse () {
  this.called = false;
};
MockResponse.prototype.send = function () {
  this.called = true;
};
MockResponse.prototype.render = function () {
  this.called = true
};
MockResponse.prototype.redirect = function () {
  this.called = true
};

function MockRequest(params, body) {
  this.params = params || {};
  this.body = body || {};
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
