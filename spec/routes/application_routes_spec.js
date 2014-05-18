describe('/applications', function () {
  beforeEach(function() {
    cleanDb();
  });

  afterEach(function () {
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
      var data = {
        request: {
          endpoint: 'Service',
          success: true
        }
      };

      new Application({ name: 'The app' }).save(function(err, app) {
        spyOn(MockResponse.prototype, 'send').andCallThrough();

        post('/requests/' + app.key, data, function () {
          expect(MockResponse.prototype.send).toHaveBeenCalledWith('Success');

          Application.findOne({ key: app.key }, function(err, app) {
            expect(app.requests.length).toEqual(1);
            expect(app.requests[0].endpoint).toEqual(data.request.endpoint);
            expect(app.requests[0].success).toEqual(data.request.success);
            done();
          });
        });
      });

    });
  });

  describe('POST /new', function(done) {
    it('should create an Application', function(done) {
      var data = {
        application: {
          name: 'A Name'
        }
      };

      post('/applications/new', data, function () {
        Application.find(function (err, apps) {
          expect(apps.length).toEqual(1);
          expect(apps[0].name).toEqual('A Name');
          done();
        });
      })

    });
  });

});
