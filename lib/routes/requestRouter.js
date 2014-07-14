var router = require('express').Router(),
  _ = require('underscore'),
  Application = require('../models/application'),
  Request = require('../models/request'),
  Q = require('q');

module.exports = function(io) {

  router.get('/:app_key/group_by/:meta_key/:meta_value', function(request, response){
    var appKey    = request.params.app_key,
        metaKey   = "meta."+request.params.meta_key,
        metaValue = request.params.meta_value,
        query     = {appKey:request.params.app_key},
        resultSet = {};

    query[metaKey] = metaValue;

    Request.distinct('name',query).exec(function (error, distinctServices){
      if (error) {
        response.send(500, error);
        return;
      }

      var promises = [];

      var buildQueryPromise = function(service) {
        return Request.find(query).sort({date: 1}).limit(5).exec(function (error, requestsDB){
          if (error) {
            response.send(500, error);
            return;
          }
          resultSet[service]=requestsDB;
        });
      };


      for(var index = 0; index<distinctServices.length; index++){
        var currentService = distinctServices[index];
        query['name']=currentService;

        var queryPromise = buildQueryPromise(currentService);
        promises.push(queryPromise);
      }

      Q.all(promises).then(function(){
        response.send(200, resultSet);
      });
    });
  });

  router.get('/groups/:app_key', function(request, response){
     Request.distinct('meta',{appKey:request.params.app_key}).exec(function (err, distinctMetadata) {
      if (err) {
        response.send(500, err);
        return;
      }

      var metaGroups = {};

      for (var distinctIndex = 0; distinctIndex < distinctMetadata.length; distinctIndex++){
        var currentMetaDict = distinctMetadata[distinctIndex];

        var pairs = _.pairs(currentMetaDict);

        for (var pairIndex=0; pairIndex<pairs.length;pairIndex++){
          var key   = pairs[pairIndex][0], 
              value = pairs[pairIndex][1];

          metaGroups[key] = metaGroups[key] || [];
          if (metaGroups[key].indexOf(value)<0) metaGroups[key].push(value);
        }
      }
      response.send(200,metaGroups);
     });

  });

  router.post('/:app_key', function(req, res) {
    var appKey = req.params.app_key;
    var data = req.body.request;
    if(!data) {
      res.send(400, {error: 'Empty data.'});
      return;
    }
    
    if(data.name === undefined || data.success === undefined) {
      res.send(400, {error: 'Invalid data. name and success fields are required.'})
      return;
    }

    Application.findOne({key: appKey}, function (err, app) {      
      if(!app || err) {
        res.send(400, {error:'Invalid application key. Please make sure the given key is correct.'});
        return;
      }
      
      var requestModel = { 
        appKey: app.key,
        name: data.name,
        success: data.success,
        date: new Date(),
        meta: data.meta
      };
      
      new Request(requestModel).save(function(err, requestDb){
        io && io.sockets.emit('newRequest', requestDb);

        res.send(200);
      });

    });
  });

  return router;
}
