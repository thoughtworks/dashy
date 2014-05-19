angular.module('app', [])

.directive('active', function ($rootScope) {
  return {
    link: function (scope, el, attrs) {
      if($rootScope.activeEnv === attrs.active) {
        el.addClass('active').siblings().removeClass('active');
      }

      el.click(function() {
        el.addClass('active').siblings().removeClass('active');
        $rootScope.$apply(function () {
          $rootScope.activeEnv = attrs.active;
        });
      });
    }
  }
})

.filter('timeAgo', function () {
  return function (date) {
    return moment(date).fromNow();
  };
});