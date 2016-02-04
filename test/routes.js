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
    var connectionString = config.test;
    
    mongoose.createConnection(connectionString);	
    
    //before, remove all users, be sure that is cheking with the test database
    User.remove({}, function(err){
      if (err){
        console.log(err);
        return done(err);
      }
      
      //add user to database
      // create the user
      var newUser            = new User();
  
      newUser.local.email    = 'mail@mail.com';
      newUser.local.password = newUser.generateHash('defaultpassword');
      newUser.local.username = 'John Doe';
      
      newUser.save(function(e) {
          if (e){
            console.log(e);
            return done(e);
          }
      });
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
        .expect('Content-Type', /json/)
		    .expect(200) //Status code
		    .end(function(err, res){
		      if (err) {
    				throw err;
    			}
    			res.body.should.have.property('username');
    			res.body.should.have.property('mail');
    			res.body.mail.should.equal(userdata.email);
    			done();
		    });

    });
  });

});
