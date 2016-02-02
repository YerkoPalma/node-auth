// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var ip       = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1";
var mongoose = require('mongoose');
//var passport = require('passport');
//var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect( (typeof process.env.OPENSHIFT_NODEJS_IP !== 'undefined' ? configDB.openshift : configDB.url) ); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({ secret: 'abcdefghijklmnopqrstuvwxyz' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Expose-Headers, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, x-session-token, *");
  res.header("Access-Control-Expose-Headers", "Access-Control-Expose-Headers, Origin, X-Requested-With, Content-Type, Accept, x-session-token, *");
  next();
});

// routes ======================================================================
//should use whole new strategy, from scratch
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app);

// launch ======================================================================
app.listen(port, ip);

module.exports = app;
