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

  $scope.search = function (query,items) {
    if (!query) return items;
    var query = query.toString().toLowerCase().trim();
    if (query==='') return items;
    res = {};
    function searchSubtree(node,subtree){
      for (var key in node){
        search_key = key.toLowerCase().toString().trim();
        if(node.hasOwnProperty(key)){
          if(search_key.search(query)>=0){
            subtree[key]=node[key];
          }else if(typeof node[key] === 'number' || typeof node[key] === 'string'){
            if(node[key].toString().toLowerCase().search(query)>=0){
              subtree[key]=node[key];
            }
          }else if(typeof node[key] === 'object'){
            var sub_res = searchSubtree(node[key],{});
            if (Object.keys(sub_res).length>0){
              subtree[key]=node[key];
            }
          }
        }
      }
      return subtree;
    }
    res = searchSubtree(items, res);
    return res;
  }
  
  $http.get('/api/apps').success(function(data){
    $scope.apps = data;
    $scope.activeApp = data[0];

    var socket = io.connect(window.location.origin);
    socket.on('newRequest', function (data) {
      $scope.$apply(function () {
        for(var i in $scope.apps) {
          if($scope.apps[i].name === data.appName) {
            if(data.appName === $scope.activeApp.name) {
              $scope.activeApp.requests = $scope.activeApp.requests || {};
              $scope.activeApp.requests[data.endpoint] = $scope.activeApp.requests[data.endpoint] || [];
              $scope.activeApp.requests[data.endpoint].push(data.request);

            }
            else {
              $scope.apps[i].requests = $scope.apps[i].requests || {};
              $scope.apps[i].requests[data.endpoint] = $scope.apps[i].requests[data.endpoint] || [];
              $scope.apps[i].requests[data.endpoint].push(data.request);
            }

            break;
          }
        }
      });

      var el = $('[endpoint="' + $scope.activeApp.key + '_' + data.endpoint + '"] li:first');
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