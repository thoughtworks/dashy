describe('Application', function() {

  describe('before save', function() {
    var app;
    beforeEach(function () {
      app = new Application({
        name: 'App Name'
      });
    });

    it('should create a key', function(done) {
      app.save(function (err, app) {
        expect(app.key).toEqual(jasmine.any(String));
        done();
      });
    });

    it('should set the date with the current date by default', function(done) {
      app.save(function (err, app) {
        expect(Application.schema.paths.date.defaultValue).toEqual(Date.now);
        done();
      });
    });
  });

});