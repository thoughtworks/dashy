var request = require('supertest')
  , app = require('../../../server')
  , expect = require('chai').expect
  , Application = require('../../../lib/models/application')
  , Request = require('../../../lib/models/request')
  ;


describe('Requets API', function() {

  describe('GET /api/requests/:app_key', function(){
    describe('when get resource', function() {
      var appKey;      
      
      //preparing database
      before(function(done) {
        Application.remove({}, function(err) {
          if(err) console.error(err);
          new Application({ name: 'The app' }).save(function (err, app) {
            appKey = app.key;

            Request.remove({}, function(err){
              new Request({appKey: appKey, success:true, name:'Service', meta:{ environment: 'Production'} }).save();
              new Request({appKey: appKey, success:false, name:'Service', meta:{ environment: 'Production'} }).save();
              new Request({appKey: appKey, success:true, name:'Service', meta:{ environment: 'QA'} }).save();
              new Request({appKey: 'AnotherAppKey' , success:false, name:'Service', meta:{ environment: 'Test'} }).save();
              for (var i=0; i<10; i++){
                // This is for testing the limit on some queries
                new Request({appKey: appKey, success:true, name:'LimitedService', meta:{ environment: 'Production', name: 'Luan'} }).save();
              }
              new Request({appKey: appKey, success:false, name:'Service', meta:{ environment: 'Production', name: 'Luan'} }).save();
              done();
            });
          });
        });
      });

      it('should return all grouping keys and possible values, with no more than 5 values per key', function(done){
        request(app)
        .get('/api/requests/groups/'+appKey)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, response){
          if (err) return done(err);

          var groups = JSON.parse(response.text);

          expect(groups).to.have.property('name');
          expect(groups['name'][0]).to.deep.equal('Luan');
          expect(groups['environment']).to.have.length(2);
          done();
        })
      });

      it('should return an array requests with no more than 5 requests on each service', function(done){
        request(app)
        .get('/api/requests/group_by/'+appKey+'/name/Luan')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, response){
          if (err) return done(err);

          var requests = JSON.parse(response.text);

          expect(requests).to.have.property('LimitedService');
          expect(requests['LimitedService']).to.have.length(5);

          expect(requests).to.have.property('Service');
          expect(requests['Service']).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('POST /api/requests/:app_key', function () {

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
          expect(data).to.deep.equal({error:'Invalid data. name and success fields are required.'});
          done();
        });
      });
    });

    describe('when request with invalid key', function () {
      it('should send a invalid key message', function (done) {
        var data = {
          request: {name: 'Service', success: true }
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
          done();
        });
      });

      it('should add requests for the application if the app_key exists', function (done) {
        request(app)
        .post('/api/requests/'+appKey)
        .send({
          request: {
            name: 'Service', 
            success: true,
            meta: {
              environment: 'Production',
              metattr: 'metaValue'
            }
          }
        })
        .expect(200)
        .end(function end(err, res){
          if (err) return done(err);
          
          Application.findOne({ key: appKey }, function (err, app) {
            expect(app.key).to.be.equal(appKey);
            Request.find({appKey: app.key}, function(err, requests) {
              
              expect(requests.length).to.be.equal(1);
              expect(requests[0].date).to.be.a('date');
              expect(requests[0].success).to.be.equal(true);
              expect(requests[0].name).to.be.equal('Service');
              expect(requests[0].meta.environment).to.be.equal('Production');
              expect(requests[0].meta.metattr).to.be.equal('metaValue');

              done();
            });
          });
        });
      });
    });
  });
});
