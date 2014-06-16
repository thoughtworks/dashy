var request = require('supertest')
  , app = require('../../server')
  , expect = require('chai').expect
  , Application = require('../../models/application')
  , Request = require('../../models/request')
  ;


describe('Applications API', function() {

  // beforeEach('clean database before testing', function(done){
  //   Application.find().all().remove();
  //   done();
  // });
  
  describe('GET /applications', function() {
    describe('when get resource /applications', function() {
      var appKey;      
        
      before(function(done) {
        Application.remove({}, function (err) {
          if(err) console.error(err);
          new Application({ name: 'The app' }).save(function (err, app) {
            appKey = app.key;  
            done();
          });
        });
      });
      
      it('should return an array of applications', function(done) {
        request(app)
        .get('/api/applications')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);

          var apps = JSON.parse(res.text);

          expect(apps.length).to.not.equal(0);
          expect(apps[0].name).to.equal('The app');
          expect(apps[0].key).to.equal(appKey);

          done();
        });
      });
    });
  });

  describe('POST /applications', function() {
    beforeEach(function(done) {
      Application.remove({}, function (err) {
        if(err) console.error(err);
        
        done();
      });
    });

    describe('when post valid form', function() {
      it('should save the application', function(done) {
        request(app)
        .post('/api/applications')
        .send({
          application: {
            name: 'A Name'
          }
        })
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);

          Application.find().exec(function(err, apps){
            expect(apps.length).to.not.equal(0);
            expect(apps[0].name).to.equal('A Name');
            done();
          });
        });
      });
    });

    describe('when post an invalid form', function() {
      it('should not save the application', function(done) {
        request(app)
        .post('/api/applications')
        .send({
          application: {
            name: undefined
          }
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) return done(err);
          
          var result = JSON.parse(res.text);
          expect(result.error).to.equal('Name is required.');
          done();
        });
      });
    });
  });
});