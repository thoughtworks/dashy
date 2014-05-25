describe('/applications', function () {

  beforeEach(cleanDb);

  describe('GET /', function() {
    it('should redirect to new app page if there is no apps yet', function(done) {
      spyOn(MockResponse.prototype, 'redirect').andCallThrough();

      get('/', function () {
        expect(MockResponse.prototype.redirect).toHaveBeenCalledWith('/applications/new');
        done();
      });
    });

    it('should assign a local apps variable to view', function (done) {
      spyOn(MockResponse.prototype, 'render').andCallThrough();

      new Application({name: 'The app'}).save(function (err, app) {
        get('/', function () {
          Application.find(function (err, apps) {
            expect(MockResponse.prototype.render).toHaveBeenCalledWith('applications/index', {
              apps: jasmine.any(Array)
            });

            done();
          });
        });
      });
    });
  });

  describe('POST /request/:app_key', function() {
    beforeEach(function () {
      spyOn(MockResponse.prototype, 'send').andCallThrough();
    });

    describe('with a invalid key', function() {
      it('should send a invalid key message', function (done) {
        post('/requests/invalid_key', {}, function() {
          expect(MockResponse.prototype.send).toHaveBeenCalledWith('Invalid application key. Please make sure the given key is correct.')
          done();
        });
      });
    });

    describe('with a valid key', function() {
      var appKey;

      beforeEach(function () {
        runs(function () {
          appKey = undefined;

          new Application({ name: 'The app' }).save(function(err, app) {
            appKey = app.key;
          });
        });

        waitsFor(function () {
          return appKey !== undefined;
        });
      });

      it('should add requests for the application if the app_key exists', function(done) {
        doRequestsForApp(appKey, function () {
          expect(MockResponse.prototype.send).toHaveBeenCalledWith('Success');

          Application.findOne({ key: appKey }, function(err, app) {
            expect(app.requests['Production']).toBeDefined();
            expect(app.requests['Production']['Service'].length).toEqual(2);
            expect(app.requests['Production']['Service'][0].date).toEqual(jasmine.any(Date));
            expect(app.requests['Production']['Service'][0].success).toEqual(true);
            expect(app.requests['Production']['Service'][1].date).toEqual(jasmine.any(Date));
            expect(app.requests['Production']['Service'][1].success).toEqual(false);

            expect(app.requests['QA']).toBeDefined();
            expect(app.requests['QA']['OtherService'].length).toEqual(1);
            expect(app.requests['QA']['OtherService'][0].date).toEqual(jasmine.any(Date));
            expect(app.requests['QA']['OtherService'][0].success).toEqual(false);

            done();
          });
        });
      });

      it('should create a default environment if the param is not given', function (done) {
        var data = {
          request: {endpoint: 'Service', success: true }
        };

        post('/requests/' + appKey, data, function () {
          Application.findOne({ key: appKey }, function(err, app) {
            expect(app.requests).toBeDefined();
            expect(app.requests['Default']['Service']).toBeDefined();
            expect(app.requests['Default']['Service'].length).toEqual(1);

            done();
          });
        });
      });
    });
  });

  describe('POST /new', function(done) {
    it('should create an Application', function(done) {
      spyOn(MockResponse.prototype, 'redirect').andCallThrough();

      var data = {
        application: {
          name: 'A Name'
        }
      };

      post('/applications/new', data, function () {
        Application.find(function (err, apps) {
          expect(apps.length).toEqual(1);
          expect(apps[0].name).toEqual('A Name');
          expect(MockResponse.prototype.redirect).toHaveBeenCalledWith('/');
          done();
        });
      })

    });
  });
});


function doRequestsForApp(appKey, callback) {
  var requestOne = {
    request: {environment: 'Production', endpoint: 'Service', success: true }
  };
  var requestTwo = {
    request: {environment: 'Production', endpoint: 'Service', success: false }
  };
  var requestThree = {
    request: {environment: 'QA', endpoint: 'OtherService', success: false }
  };

  post('/requests/' + appKey, requestOne, function () {
    post('/requests/' + appKey, requestTwo, function () {
      post('/requests/' + appKey, requestThree, function () {
        callback && callback();
      });
    });
  });
}