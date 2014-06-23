angular.module('app', ['ngRoute', 'ui.utils', 'underscore', 'socket.io', 'ui.bootstrap.popover'])

.controller('NewController', function($scope, $location, DashyAPI){
  $scope.application = {};

  $scope.submitNewApp = function(app){
    DashyAPI.postApplication(app, function(data){
      $location.path('/list/'+data.key);
    });
  };
})

.controller('ListController', 
    function($scope, $location, $routeParams, DashyAPI, _, io){
  $scope.open = false;
  $scope.activeApp = undefined;
  $scope.metaKeys = undefined;
  $scope.groupedBySelectedMetaKey = undefined;
  $scope.selectedMetaKey = undefined;
  $scope.limitPerName = 5;
  $scope.showGroupBar = true;
  $scope.highlightText = undefined;

  $scope.selectMetaKeyOnChange = function(){
    $scope.reloadMetaKeys();
  }

  $scope.selectMetaKeyValue = function(key){
    $scope.selectedMetaKeyValue = key;
  }
  
  $scope.openClick = function(){
    $scope.open = !$scope.open;  
  }

  $scope.selectAppClick = function(app){
    $scope.activeApp = app;
    $scope.open = false;

    $location.path('/list/'+app.key);
  }

  $scope.buildMetaKeys = function () {
    var requests = $scope.activeApp.requests;
    var result = [];

    _.each(requests, function(req){
      if(req.hasOwnProperty('meta')){
        result.push(Object.keys(req.meta));
      }
    });
    return _.uniq(_.flatten(result));
  };

  $scope.groupBy = function (obj, values, context) {
    if (typeof values === 'string'){
      return _.groupByMulti(obj, [values], context);
    } else {
      return _.groupByMulti(obj, values, context);
    }
  };

  $scope.reloadMetaKeys = function(){
    $scope.metaKeys = $scope.buildMetaKeys();
    $scope.groupedBySelectedMetaKey = $scope.groupBy(
      $scope.activeApp.requests, 
      [function(it){
        return it.meta[$scope.selectedMetaKey];
      }, 
      'name']
    );
    var keys = _.keys($scope.groupedBySelectedMetaKey);
    $scope.selectedMetaKeyValue = keys[0];
    $scope.showGroupBar = keys.length > 1;
  }

  $scope.highlightSearch = function(newValue, oldValue){
    if ($scope.activeApp) {
      _.each($scope.activeApp.requests, function(it){
        it._highlighted = (function meta(meta){
          if (!newValue) return false;

          var keys = _.keys(meta)
          for (var i in keys){
            if (meta[keys[i]].toString().indexOf(newValue) > -1) return true;
          }

          return false;
        })(it.meta);
      });
    }
  };

  $scope.$watch('highlightText', $scope.highlightSearch);

  DashyAPI.getApplications(function(data){
    $scope.apps = data;
    $scope.activeApp = _.find(data, function(app){
      return app.key == $routeParams.appKey;
    });

    DashyAPI.getRequests($scope.activeApp, function(requests){
      $scope.activeApp.requests = requests;
      $scope.reloadMetaKeys();
    });

    var socket = io.connect(window.location.origin);
    socket.on('newRequest', function (data) {
      $scope.$apply(function () {
        if($scope.activeApp.key === data.appKey) {
          $scope.activeApp.requests.push(data);
          $scope.reloadMetaKeys();
        }
      });

      var el = $('[service="' + $scope.activeApp.key + '_' + $scope.selectedMetaKeyValue + '_' + data.name + '"] li:first');
      el.addClass('spawned');
      setTimeout(function () {
        el.removeClass('spawned');
      }, 1000);
    });
    
  });
})

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/list/:appKey/', {
      templateUrl: 'partials/list.html'
    }).
    when('/new', {
      templateUrl: 'partials/new.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}])

.directive('timeAgo', ['$interval', function ($interval) {
  return {
    link: function (scope, el, attrs) {
      var timer;

      scope.$watch(function () {
        el.text(moment(attrs.timeAgo).fromNow());
      });

      timer = $interval(function () {
          el.text(moment(attrs.timeAgo).fromNow());
      }, 60 * 1000);

      el.on('$destroy', function (){
        $interval.cancel(timer);
      });
    }
  };
}])

.filter('timeAgo', function () {
  return function (date) {
    return moment(date).fromNow();
  };
})

.service('DashyAPI', function DashyAPI($http){
    this.getRequests = function(app, successCallback){
      $http.get('/api/requests/'+app.key).success(successCallback);
    };

    this.postApplication = function(app, successCallback){
      $http.post('/api/applications', {'application': app}).success(successCallback);
    }

    this.getApplications = function(successCallback){
      $http.get('/api/applications').success(successCallback); 
    }
})

.directive('dashyGroup', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/group.html'
  }
})

.run(function($location, DashyAPI){
  DashyAPI.getApplications(function(data){
    if (data && data.length > 0){
      $location.path('/list/'+data[0].key);
    } else {
      $location.path('/new');
    }
  });
});

angular.module('underscore', [])
.factory('_', function() {
  var _ = window._;
  _.groupByMulti = function (obj, values, context) {
    if (!values.length)
      return obj;
    var byFirst = _.groupBy(obj, values[0], context),
      rest = values.slice(1);
    for (var prop in byFirst) {
      byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
    }
    return byFirst;
  };
  return _;
});

angular.module('socket.io', [])
.factory('io', function(){
  return window.io;
});