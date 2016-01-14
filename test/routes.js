var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
//var winston = require('winston');
var config = require('../config/database.js');
var app = require('../server.js');
var agent = request.agent(app);

describe('Routing', function() {
  
  before(function(done) {
    mongoose.connect(config.url);	//testDB is empty, so connect to passport db for now
    done();
  });
  
  describe('login', function(){
    it('should get JSON data after login', function(done){
      
      var userdata = {
        email: '',
        password: ''
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
      
    })
  });
  
});