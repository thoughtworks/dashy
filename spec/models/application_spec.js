describe('Application', function () {

  it('should set the request.date default value with Date.now', function () {
    expect(Application.schema.paths.requests.schema.paths.date.defaultValue).toEqual(Date.now);
  });

  it('should have attribute key as unique', function() {
    expect(Application.schema.paths.key.options.unique).toEqual(true);
  });

  describe('before save', function () {
    var app;

    beforeEach(function() {
      runs(function () {
        new Application({name: 'App Name'}).save(function (err, a) {
          app = a;
        });
      });

      waitsFor(function () {
        return app;
      });
    });

    it('should create a key', function () {
      expect(app.key).toEqual(jasmine.any(String));
    });

    it('should create a key only if the recrod is new', function (done) {
      app.save(function (err, a) {
        expect(app.key).toEqual(a.key);
        done();
      });
    });
  });

});