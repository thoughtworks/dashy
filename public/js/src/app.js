angular.module('app', ['ngRoute', 'ui.utils', 'underscore'])

.controller('NewController', function($scope, $http, $location){
  $scope.application = {};
  
  $scope.submitNewApp = function(app){
    $http.post('/api/applications', {'application': app})
    .success(function(data){
      $location.path("/list");
    });
  };
})

.controller('ListController', function($rootScope, $scope, $http, $location, DashyAPI, _){
  $scope.openClick = function(){
    $scope.open = !$scope.open;  
  }

  $scope.selectAppClick = function(app){
    $scope.activeApp = app;
    $scope.open = false;

    DashyAPI.loadRequests(app, function(requests){
      $scope.activeApp.requests = requests;
    });
  }

  $scope.groupBy = function(items, label){
    return _.groupBy(items, label);
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
  
  

  $http.get('/api/applications').success(function(data){
    $scope.apps = data;
    $scope.activeApp = data[0];

    DashyAPI.loadRequests(data[0], function(requests){
      $scope.activeApp.requests = requests;
    });

    var socket = io.connect(window.location.origin);
    socket.on('newRequest', function (data) {
      $scope.$apply(function () {
        if($scope.activeApp.key === data.appKey) {
          $scope.activeApp.requests.push(data);
        }
      });

      var el = $('[service="' + $scope.activeApp.key + '_' + data.service + '"] li:first');
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

.service('DashyAPI', function DashyAPI($http){
    this.loadRequests = function loadRequests(app, callback){
      $http.get('/api/requests/'+app.key).success(function (data){
        callback(data);
      });
    };
})

.run(function($http, $location){
  $http.get('/api/applications').success(function(data){
    if (data && data.length > 0){
      $location.path("/list");
    } else {
      $location.path("/new");
    }
  });
});

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});