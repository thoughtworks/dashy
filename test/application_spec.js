var Application = require('../models/application')
  , app = require('../server')
  , expect = require('chai').expect;

describe('models/Application', function () {

  it('should have attribute key as unique', function() {
    expect(Application.schema.paths.key.options.unique).to.equal(true);
  });

  describe('before save', function () {
    var app;

    beforeEach(function (done) {
      new Application({name: 'App Name'}).save(function (err, application) {
        app = application;
        done();
      });
    });

    it('should create a key', function () {
      expect(app.key).to.be.a('string');
    });

    it('should generate a new key only if the recrod is new', function (done) {
      app.save(function (err, application) {
        expect(app.key).to.equal(application.key);
        done();
      });
    });
  });

});