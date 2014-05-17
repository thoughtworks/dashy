describe('Application', function () {

  it('should set the request.date default value with Date.now', function () {
    expect(Application.schema.paths.requests.schema.paths.date.defaultValue).toEqual(Date.now);
  });

  describe('before save', function () {
    it('should create a key', function (done) {
      var app = new Application({
        name: 'App Name'
      });

      app.save(function (err, app) {
        expect(app.key).toEqual(jasmine.any(String));
        done();
      });
    });
  });

});