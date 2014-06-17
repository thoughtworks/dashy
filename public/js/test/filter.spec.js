describe('ListController', function () {

  var scope;
  beforeEach(angular.mock.inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('ListController', {
      $scope: scope,
      DashyAPI: {
        loadRequests: function (app, callback) {
          callback([]);
        }
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
  
  it('should get all items back if the query is an empty string', function (ListController) {
    expect(scope.search('',[{a:12}])).toEqual([{a:12}]);
    expect(scope.search(' ',[1,2,3])).toEqual([1,2,3]);
    expect(scope.search(undefined,[1,2,3])).toEqual([1,2,3]);
  });

  it('should rebuild and object based on keys and values that match the query', function (ListController) {
    var items = {
      abc:{key:9},
      dfg:{1:'value'},
      hrf:{chave:'value'},
      secret:{sub:{tree:{found:'s3cr3t'}}},
      request:{"<ENDPOINT>":[
        {"environment":"<ENVIRONMENT>",
        "date":"2014-06-15T23:17:42.364Z","success":"<true|false>"},
        {"environment":"<ENVIRONMENT>","date":"2014-06-15T23:17:45.586Z",
          "success":"<true|false>"},
        {"environment":"<ENVIRONMENT>",
        "date":"2014-06-15T23:18:12.889Z","success":false}
        ]
      } 
    };
    expect(scope.search('KEY',items)).toEqual({abc:{key:9}});
    expect(scope.search('abc',items)).toEqual({abc:{key:9}});
    expect(scope.search('vAlUe',items)).toEqual({dfg:{1:'value'},hrf:{chave:'value'}});
    expect(scope.search('s3cr3t',items)).toEqual({secret:{sub:{tree:{found:'s3cr3t'}}}});
    expect(scope.search('endp',items['request'])).toEqual(items['request']);
  });

});