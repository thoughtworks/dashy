describe('/applications', function () {
  beforeEach(function() {
    cleanDb();
  });

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
    it('should validate if the app_key exists', function (done) {
      spyOn(MockResponse.prototype, 'send').andCallThrough();

      post('/requests/invalid_key', {}, function() {
        expect(MockResponse.prototype.send).toHaveBeenCalledWith('Invalid application key. Please make sure the given key is correct.')
        done();
      });
    });

    it('should create a request for the application if the app_key exists', function(done) {
      spyOn(MockResponse.prototype, 'send').andCallThrough();
      var data = {
        request: {
          environment: 'Production',
          endpoint: 'Service',
          success: true
        }
      };
      var data2 = {
        request: {
          environment: 'Production',
          endpoint: 'Service',
          success: false
        }
      };
      var data3 = {
        request: {
          environment: 'QA',
          endpoint: 'OtherService',
          success: false
        }
      };

      new Application({ name: 'The app' }).save(function(err, app) {
        post('/requests/' + app.key, data, function () {
          post('/requests/' + app.key, data2, function () {
            post('/requests/' + app.key, data3, function () {
              expect(MockResponse.prototype.send).toHaveBeenCalledWith('Success');

              Application.findOne({ key: app.key }, function(err, app) {
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
