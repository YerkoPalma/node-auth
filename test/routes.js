var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
//var winston = require('winston');
var config = require('../config/database.js');
var app = require('../server.js');
var User       = require('../app/models/user');
var agent = request.agent(app);

describe('Routing', function() {

  before(function(done) {
    
    //if the test is run inside wercker container use wercker host for mongodb
    var connectionString = (typeof process.env.MONGO_PORT_27017_TCP_PORT === 'undefined' ? config.test : config.wercker);
    
    mongoose.createConnection(connectionString);	//testDB is empty, so connect to passport db for now
    
    //add user to database
    // create the user
    var newUser            = new User();

    newUser.local.email    = 'mail@mail.com';
    newUser.local.password = newUser.generateHash('defaultpassword');

    newUser.save(function(err) {
        if (err)
            return done(err);

        //return done(null, newUser);
    });
    done();
  });

  describe('login', function(){
    it('should get JSON data after login', function(done){

      var userdata = {
        email: 'mail@mail.com',
        password: 'defaultpassword'
      };

      agent
        .post('/login')
        .send(userdata)
        //.expect('Content-Type', /json/)
		    .expect(200) //Status code
		    .end(function(err, res){
		      if (err) {
    				throw err;
    			}
    			res.body.should.have.property('_id');
    			res.body.should.have.property('local');
    			res.body.local.email.should.equal(userdata.email);
    			done();
		    });

    });
  });

});
