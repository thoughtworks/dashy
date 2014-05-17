var Application = require('../../models/Application');

describe('Application', function() {
  it('should connect do database', function(done) {
    var app = new Application({
      name: 'armaria nãm'
    });

    app.save(function (err, app) {
      expect(app.name).toEqual('armaria nãm');
      done();
    });

  });
});