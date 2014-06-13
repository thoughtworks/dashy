angular.module('app', ['ngRoute'])

.controller('NewController', function($scope, $http, $location){
  $scope.application = {};
  
  $scope.submitNewApp = function(app){
    $http.post('/api/applications/new', {'application': app})
    .success(function(data){
      $location.path("/list");
    });
  };
})

.controller('ListController', function($rootScope, $scope, $http, $location){
  $scope.openClick = function(){
    $scope.open = !$scope.open;  
  }

  $scope.selectAppClick = function(app){
    $scope.activeApp = app;
    $scope.open = false
  }
  
  $http.get('/api/apps').success(function(data){
    $scope.apps = data;
    $scope.activeApp = data[0];
    
    if($scope.activeApp.requests) {
      $scope.activeEnd = Object.keys($scope.activeApp.requests)[0];
      $rootScope.activeEnv = $scope.activeEnv;
    }

    var socket = io.connect(window.location.origin);
    socket.on('newRequest', function (data) {
      $scope.$apply(function () {
        for(var i in $scope.apps) {
          if($scope.apps[i].name === data.appName) {
            if(data.appName === $scope.activeApp.name) {
              $scope.activeApp.requests = $scope.activeApp.requests || {};
              $scope.activeApp.requests[data.environment] = $scope.activeApp.requests[data.environment] || {};
              $scope.activeApp.requests[data.environment][data.endpoint] = $scope.activeApp.requests[data.environment][data.endpoint] || [];
              $scope.activeApp.requests[data.environment][data.endpoint].push(data.request);

              if(!$scope.activeEnv) {
                $scope.activeEnv = data.environment;
                $rootScope.activeEnv = $scope.activeEnv;
              }
            }
            else {
              $scope.apps[i].requests = $scope.apps[i].requests || {};
              $scope.apps[i].requests[data.environment] = $scope.apps[i].requests[data.environment] || {};
              $scope.apps[i].requests[data.environment][data.endpoint] = $scope.apps[i].requests[data.environment][data.endpoint] || [];
              $scope.apps[i].requests[data.environment][data.endpoint].push(data.request);
            }

            break;
          }
        }
      });

      var el = $('[endpoint="' + data.environment + '_' + data.endpoint + '"] li:first');
      el.addClass('spawned');
      setTimeout(function () {
        el.removeClass('spawned');
      }, 1000);
    });
    
  });
})

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/list', {
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

.run(function($http, $location){
  $http.get('/api/apps').success(function(data){
    if (data && data.length > 0){
      $location.path("/list");
    } else {
      $location.path("/new");
    }
  });
})

;