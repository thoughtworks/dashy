var request = require('supertest')
  , app = require('../server')
  , expect = require('chai').expect
  , Application = require('../models/application');


describe('Apps API', function() {

beforeEach('clean database before testing', function(done){
  //Application.find().all().remove();
  done();
});
  
  describe('GET /apps', function() {
    describe('when get resource /apps', function() {
      var appKey;      
        
      before(function(done) {
        Application.remove({}, function (err) {
          if(err) console.error(err);
          new Application({ name: 'The app' }).save(function (err, app) {
            appKey = app.key;
          });
          
          done();
        });
      });
      
      it('should return an array of apps', function(done) {
        request(app)
        .get('/api/apps')
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

  describe('POST /api/request/:app_key', function () {

    describe('when request with empty data', function () {
      it('should send an empty data message', function (done) {
        request(app)
        .post('/api/requests/empty_data')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function end(err, res){
          if (err) return done(err);

          var data = JSON.parse(res.text);
          expect(data).to.deep.equal({error:'Empty data.'});
          done();
        });
      });
    });

    describe('when request with invalid data', function () {
      it('should send an invalid data message', function (done) {
        request(app)
        .post('/api/requests/invalid_data')
        .expect('Content-Type', /json/)
        .send({request:{}})
        .expect(400)
        .end(function end(err, res){
          if (err) return done(err);

          var data = JSON.parse(res.text);
          expect(data).to.deep.equal({error:'Invalid data.'});
          done();
        });
      });
    });

    describe('when request with invalid key', function () {
      it('should send a invalid key message', function (done) {
        var data = {
          request: {endpoint: 'Service', success: true }
        };
        request(app)
        .post('/api/requests/invalid_key')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function end(err, res){
          if (err) return done(err);
          var data = JSON.parse(res.text);
          expect(data).to.deep.equal({error:'Invalid application key. Please make sure the given key is correct.'});
          done();
        });
      });
    });

    describe('when request with a valid key', function () {
      var appKey;      
    
      before(function(done){
        new Application({ name: 'The app' }).save(function (err, app) {
          appKey = app.key;
        });
        done();
      });

      it('should add requests for the application if the app_key exists', function (done) {
        request(app)
        .post('/api/requests/'+appKey)
        .send({
          request: {
            environment: 'Production', 
            endpoint: 'Service', 
            success: true 
          }
        })
        .expect(200)
        .end(function end(err, res){
          if (err) return done(err);
          Application.findOne({ key: appKey }, function (err, app) {
            expect(app.requests).not.to.be.undefined;
            expect(app.requests['Service']).not.to.be.undefined;
            expect(app.requests['Service'].length).to.be.equal(1);
            expect(app.requests['Service'][0].date).to.be.a('date');
            expect(app.requests['Service'][0].success).to.be.equal(true);
            expect(app.requests['Service'][0].environment).to.be.equal('Production');

            done();
          });
        });
      });
    });
  });

  describe('POST /applications/new', function() {
    beforeEach(function(done) {
      Application.remove({}, function (err) {
        if(err) console.error(err);
        
        done();
      });
    });

    describe('when post valid form', function() {
      it('should save the application', function(done) {
        request(app)
        .post('/api/applications/new')
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
          });

          done();
        });
      });
    });

    describe('when post an invalid form', function() {
      it('should not save the application', function(done) {
        request(app)
        .post('/api/applications/new')
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