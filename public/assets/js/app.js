angular.module('app', [])

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
});