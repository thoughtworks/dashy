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
      expect(location.path()).toMatch(/\/list\/(\w)+/);
    });
  });
});

describe('ListController', function () {

  var scope;
  var routeParams;
  var mockedGroups = {"environment":["ba","qa1"], "name":'Victor'};
  beforeEach(angular.mock.inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    routeParams = { appKey: 'my key'};
    $controller('ListController', {
      $scope: scope,
      $routeParams: routeParams,
      DashyAPI: {
        getRequests: function (app, callback) {
          callback([]);
        },
        getApplications: function(callback){
          callback([{name: 'My App', key: 'my key'}]);
        },
        getGroups: function(app, callback){
          callback(mockedGroups);
        },
        getRequestsByGroup: function(app, metaKey, metaValue, callback){
          callback({ba:[{name:'service', success:false, meta:{environment:'ba'}}]});
        }
      },
      io: {
        connect: function(url){
          return {
            on: function(data) {}
          }
        }
      }
    });
  }));

  it('should reload meta keys from server and select the first', function(){
    scope.activeApp = {key:'mocked'};
    scope.reloadMetaKeys();
    expect(scope.metaValues).toEqual(mockedGroups);
    expect(scope.metaKeys).toEqual(['environment','name']);
    expect(scope.selectedMetaKey).toEqual('environment');
    expect(scope.selectedMetaValue).toEqual('ba');
    
    expect(scope.showGroupBar).toEqual(true);

  });

  it('should select an app', function(){
    var app = {
      name: 'name',
      key: 'my key'
    };
    scope.selectAppClick(app);

    expect(scope.activeApp).toEqual(app);
    expect(scope.open).toEqual(false);
  });

  it('should set _highlighted values when input the search', function(){
    var items = [
      {name:'service', success:false, meta:{environment:'dev'}},
      {name:'service', meta:{telephone:121212, environment:'qa'}},
      {name:'service', meta:{telephone:1321321, status:404, environment:'prod'}},
      {name:'service', success:true, meta:{environment:'dev'}}
    ];

    var expected = [
      {name:'service', success:false, meta:{environment:'dev'}, _highlighted: true},
      {name:'service', meta:{telephone:121212, environment:'qa'}, _highlighted: false},
      {name:'service', meta:{telephone:1321321, status:404, environment:'prod'}, _highlighted: false},
      {name:'service', success:true, meta:{environment:'dev'}, _highlighted: true}
    ];

    scope.activeApp.requests = _.clone(items);
    scope.highlightSearch('dev');

    expect(expected).toEqual(scope.activeApp.requests);
    // expect(scope.groupedBySelectedMetaKey).toEqual(expected);
  });

});