var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';


app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, 'public/assets')));

require('./config/database');

app.use('/', routes);

var server;

exports.startServer = function(cb) {
  app.set('port', process.env.PORT || 3000);

  server = app.listen(app.get('port'), function () {
    typeof cb === 'function' && cb();
  });
};

exports.closeServer = function(cb) {
  if (server) {
    server.close(cb);
  }
}

// when app.js is launched directly
if (module.id === require.main.id) {
  exports.startServer(function() {
    console.log('Express server listening on port ' + server.address().port);
  });
}

function setupViews(app) {
  app.set('views', path.join(__dirname, 'public/views'));
  app.set('view engine', 'jade');
}

function setupMiddlewares(app) {
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(require('less-middleware')(path.join(__dirname, 'public/assets')));
  app.use(express.static(path.join(__dirname, 'public/assets')));

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
}

function setupErrorHandlers(app) {
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });
}