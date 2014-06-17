var express           = require('express'),
    path              = require('path'),
    favicon           = require('static-favicon'),
    logger            = require('morgan'),
    cookieParser      = require('cookie-parser'),
    bodyParser        = require('body-parser'),
    app               = express(),
    server            = require('http').createServer(app),
    io                = require('socket.io').listen(server),
    requestRouter     = require('./routes/requestRouter')(io),
    applicationRouter = require('./routes/applicationRouter')()
    ;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

setupMiddlewares();
setupErrorHandlers();
setupDatabase();
setupRoutes();

startServer();

function startServer () {
  app.set('port', process.env.PORT || 3000);

  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
  });
}

function setupRoutes () {
  app.use('/api/requests', requestRouter);
  app.use('/api/applications', applicationRouter);

  //retro-compatibility
  app.post('/requests/:app_key', requestRouter.post('/:app_key'));
}

function setupDatabase () {
  require('./config/database');
}

function setupMiddlewares () {
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(require('less-middleware')(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));
}

function setupErrorHandlers () {
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

module.exports = app;