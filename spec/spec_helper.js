require('../config/database');
var router = require('../routes/index');

module.exports = {
  Application: require('../models/application'),
  cleanDb: cleanDb,

  MockResponse: MockResponse,
  post: function (url, data, callback) {
    for(var i in router.stack) {
      var route = router.stack[i];

      if(route.regexp.test(url) && route.route.methods.post) {
        var matches = url.match(route.regexp);
        var keys = {};

        for(var j = 0; j < route.keys.length; j++) {
          keys[route.keys[j].name] = matches[j+1];
        }
        for(var j in route.route.stack) {
          if(route.route.stack[j].method === 'post') {
            var res = new MockResponse();

            route.route.stack[j].handle(new MockRequest(keys, data), res);

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
MockResponse.prototype.send = function (url) {
  this.called = true;
};
MockResponse.prototype.render = function (url, params) {
  this.called = true
};
MockResponse.prototype.redirect = function (url, params) {
  this.called = true
};

function MockRequest(params, body) {
  this.params = params;
  this.body = body;
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
