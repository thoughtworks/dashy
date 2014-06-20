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
        }
      },
      io: {
        connect: function(url){}
      }
    });
  }));


  it('should group requests by service', function(){
    var items = [{service: 'S1', id:1}, {service: 'S2', id:2}, {service: 'S1', id:3}];
    var result = scope.groupBy(items, 'service');
    var expected = { 
      S1 : [ { service : 'S1', id : 1 },{ service : 'S1', id : 3 } ], 
      S2 : [ { service : 'S2', id : 2 } ] 
    };

    expect(expected).toEqual(result);
  });

  it('should be able to group services by custom key', function(){
    var items = [
      {name:'service', success:false, meta:{environment:'dev'}},
      {name:'service', meta:{telephone:121212, environment:'qa'}},
      {name:'service', meta:{telephone:1321321, status:404, environment:'prod'}},
      {name:'service', success:true, meta:{environment:'dev'}},
      {name:'service2', success:true, meta:{environment:'dev'}},
      {name:'service2', success:false, meta:{}}
    ];

    var expected = {
      dev:{
        service: [
          {name:'service', success:false, meta: {environment:'dev'}},
          {name:'service', success:true, meta: {environment:'dev'}},
        ],
        service2: [
          {name:'service2', success:true, meta:{environment:'dev'}}
        ]
      },
      qa:{
        service: [
          {name:'service', meta:{telephone:121212, environment:'qa'}}
        ]
      },
      prod:{
        service: [
          {name:'service', meta:{telephone:1321321, status:404, environment:'prod'}}
        ]
      },
      undefined: {
        service2: [
          {name:'service2', success:false, meta:{}}
        ]
      }
    };

    var result = scope.groupBy(
      items, 
      [
        function(item){
          return item.meta.environment;
        }, 
        function(item){
          return item.name;
        }
      ]
    );

    expect(expected).toEqual(result);
  });

  it('should get all available grouping keys', function(){
    var expected = ['environment', 'telephone', 'status'];
    scope.activeApp.requests = [
      {name:'service', success:false, meta:{environment:'dev'}},
      {name:'service', meta:{telephone:121212, environment:'qa'}},
      {name:'service', meta:{telephone:1321321, status:404, environment:'prod'}},
      {name:'service', success:true, meta:{environment:'dev'}}
    ];
    var result = scope.buildMetaKeys();
    expect(expected).toEqual(result);
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

});