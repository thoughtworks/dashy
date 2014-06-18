describe('NewController', function () {
  var scope, location;
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $location) {
    scope = $rootScope.$new();
    location = $location;

    $controller('NewController', {
      $scope: scope,
      $location: location,
      DashyAPI: {
        postApplication: function(app, callback){
          callback(app);
        }
      }
    });
  }));

  describe('when loads', function(){
    it('should have a application object', function(){
      expect(scope.application).toEqual({});
    });
  });

  describe('when submit a new application', function(){
    it('should change the location to /list', function(){
      scope.submitNewApp({name: 'name'})
      expect(location.path()).toEqual('/list');
    });
  });
});

describe('ListController', function () {

  var scope;
  beforeEach(angular.mock.inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('ListController', {
      $scope: scope,
      DashyAPI: {
        getRequests: function (app, callback) {
          callback([]);
        },
        getApplications: function(callback){
          callback([{name: 'My App', key: 'my key'}]);
        }
      },
      io: {
        connect: function(url){}
      }
    });
  }));

  it('should group by service', function(){
    var items = [{service: 'S1', id:1}, {service: 'S2', id:2}, {service: 'S1', id:3}];
    var result = scope.groupBy(items, 'service');
    var expected = { S1 : [ { service : 'S1', id : 1 }, { service : 'S1', id : 3 } ], S2 : [ { service : 'S2', id : 2 } ] };

    expect(result).toEqual(expected);
  });

  it('should select an app', function(){
    var app = {
      name: 'name',
      key: 'mykey'
    };
    scope.selectAppClick(app);

    expect(scope.activeApp).toEqual(app);
    expect(scope.open).toEqual(false);
    expect(scope.activeApp.requests).toEqual([]);
  });

});