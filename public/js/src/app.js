angular.module('app', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/list'
    }).
    when('/new', {
      templateUrl: 'partials/new'
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}])

.directive('activeEnv', function ($rootScope) {
  return {
    link: function (scope, el, attrs) {
      if($rootScope.activeEnv === attrs.activeEnv) {
        el.addClass('active').siblings().removeClass('active');
      }

      el.click(function() {
        el.addClass('active').siblings().removeClass('active');
        $rootScope.$apply(function () {
          $rootScope.activeEnv = attrs.activeEnv;
        });
      });
    }
  }
})

.directive('timeAgo', function () {
  return {
    link: function (scope, el, attrs) {
      setInterval(function () {
        el.text(moment(attrs.timeAgo).fromNow());
      }, 60 * 1000);
    }
  };
})

.filter('timeAgo', function () {
  return function (date) {
    return moment(date).fromNow();
  };
})

.run(function ($rootScope, $http) {
        $http.get('/api/apps').success(function(data){

          $rootScope.apps = data;
          $rootScope.activeApp = $rootScope.apps[0];

          if($rootScope.activeApp.requests) {
            $rootScope.activeEnv = Object.keys($rootScope.activeApp.requests)[0];
          }

          var socket = io.connect(window.location.origin);
          socket.on('newRequest', function (data) {
            $rootScope.$apply(function () {
              for(var i in $rootScope.apps) {
                if($rootScope.apps[i].name === data.appName) {
                  if(data.appName === $rootScope.activeApp.name) {
                    $rootScope.activeApp.requests = $rootScope.activeApp.requests || {};
                    $rootScope.activeApp.requests[data.environment] = $rootScope.activeApp.requests[data.environment] || {};
                    $rootScope.activeApp.requests[data.environment][data.endpoint] = $rootScope.activeApp.requests[data.environment][data.endpoint] || [];
                    $rootScope.activeApp.requests[data.environment][data.endpoint].push(data.request);

                    if(!$rootScope.activeEnv) {
                      $rootScope.activeEnv = data.environment;
                    }
                  }
                  else {
                    $rootScope.apps[i].requests = $rootScope.apps[i].requests || {};
                    $rootScope.apps[i].requests[data.environment] = $rootScope.apps[i].requests[data.environment] || {};
                    $rootScope.apps[i].requests[data.environment][data.endpoint] = $rootScope.apps[i].requests[data.environment][data.endpoint] || [];
                    $rootScope.apps[i].requests[data.environment][data.endpoint].push(data.request);
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
      });
