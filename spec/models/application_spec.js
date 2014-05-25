describe('Application', function () {

  it('should have attribute key as unique', function() {
    expect(Application.schema.paths.key.options.unique).toEqual(true);
  });

  describe('before save', function () {
    var app;

    beforeEach(function () {
      runs(function () {
        new Application({name: 'App Name'}).save(function (err, application) {
          app = application;
        });
      });

      waitsFor(function () {
        return app;
      });
    });

    it('should create a key', function () {
      expect(app.key).toEqual(jasmine.any(String));
    });

    it('should generate a new key only if the recrod is new', function (done) {
      app.save(function (err, application) {
        expect(app.key).toEqual(application.key);
        done();
      });
    });
  });

});