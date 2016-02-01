// load up the user model
var User       = require('../app/models/user');
var Guid       = require('guid')

module.exports = function(app) {

// routes ======================================================================
//      POST  /login
//      POST  /signup
//      GET   /profile  (require authorization)
//      POST  /logout

    app.post('/login', function(req, res) {

        //find the user
        var email = req.body.email;
        var password = req.body.password;

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err){
                  res.status(500);
                  res.send({
                    code: "001",
                    message: "Some error with the server. Please try later"
                  });
                }

                // if no user is found, return the message
                if (!user){
                  res.status(404);
                  res.send({
                    code: "002",
                    message: "User not found"
                  });
                }

                if (!user.validPassword(password)){
                  res.status(401);
                  res.send({
                    code: "003",
                    message: "Invalid password, please try again"
                  });
                }

                // all is well, return user
                else{
                  res.status(200);
                  //create a new token
                  var guid = Guid.create();
                  User.update(
                    { 'local.email' :  email },
                    {$set: { 'token': guid.value }},
                    function(e, num){
                      if(e){
                        res.status(500);
                        res.send({
                          code: "004",
                          message: "Some error with the database"
                        })
                      }
                    }
                  )
                  req.session.user = user; //try to save to session
                  res.set('x-session-token', guid.value); //send the token as a header
                  res.json(user.local);
                }
            });
        });
    });

    app.post('/signup', function(req, res){
      //get user data
      //find the user
      var email = req.body.email;
      var password = req.body.password;

      var new_user = {
        local : {
          email: email,
          password: password
        }
      }

      //check user data
      process.nextTick(function(){
        User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error
          if (err){
            res.status(500);
            res.send({
              code: "001",
              message: "Some error with the server. Please try later"
            });
          }

          // if there is already an user with that email
          if (user){
            res.status(400);
            res.send({
              code: "005",
              message: "User already exists"
            });
          }
        });

        //password is fine
        var guid = Guid.create();
        new_user.token = guid.value;
        var user = new User(new_user);
        user.local.password = user.generateHash(password)
        /*if (!user.validPassword(password)){
          res.status(401);
          res.send({
            code: "003",
            message: "Invalid password, please try again"
          });
        }*/

        //all fine, save the user
        user.save(function(err){
          if (err) {
            res.status(500);
            res.send({
              code: "001",
              message: "Some error with the server. Please try later"
            });
          }
          //user saved!
          req.session.user = user; //try to save to session
          res.set('x-xession-token', guid.value); //send the token as a header
          res.json(user.local);
        });
      });

    });

    app.get('/profile', isLoggedIn, function(req, res){

      var user;
      if (typeof req.session !== 'undefined'){
        if (req.session.user){
          user = req.session.user;
        }
      }
      //if there is any problem with the session, find it from the DB
      if (typeof user === 'undefined'){
        if (typeof req.headers !== 'undefined') {
          User.findOne({'token' : req.headers['x-session-token']}, function(err, _user){
            if (err) {
              res.status(500);
              res.send({
                code: "001",
                message: "Some error with the server. Please try later"
              });
            }

            if (!_user) {
              res.status(500);
              res.send({
                code: "007",
                message: "User lost!"
              });
            }

            user = _user;
          })
        } else {
          res.status(500);
          res.send({
            code: "007",
            message: "User lost!"
          });
        }
      }

      res.json(user.local);
    });

    app.post('/logout', isLoggedIn, function(req, res){

      //reset the session
      if (typeof req.session !== 'undefined'){
        if (req.session.user){
          req.session.user = undefined;
        }
      }

      var token;
      //reset the user connected in database
      if (typeof req.headers !== 'undefined') {
        token = req.headers['x-session-token'];
      } else {
        if (typeof req.cookies.token !== 'undefined'){
          token = req.cookies.token;
          //no user logged in
        } else {
          res.status(400);
          res.send({
            code: "008",
            message: "No user logged in!"
          });
        }
      }

      User.update(
        {'token' : token},
        {$set: { 'token': '' }},
        function(err, num){
          if (err) {
            res.status(500);
            res.send({
              code: "001",
              message: "Some error with the server. Please try later"
            });
          }

      })
      //return some confirmation message
      res.status(200);
      res.json({
        code: "100",
        message: "succesfully logged out"})
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    //if the session token comes in the header
    if (typeof req.headers !== 'undefined') {
      //and if belongs to a user
      User.findOne({
        'token' : req.headers['x-session-token']
      }, function(err, user){
        if (err) {
          res.status(500);
          res.json({
            code: "001",
            message: "Some error with the server. Please try later"
          });
        }

        if (!user) {
          res.status(400);
          res.json({
            code: "006",
            message: "User not found on Db. Please log in first"
          });
        } else {
          req.session.user = user; //try to save to session
          next();
        }
      })
    }else{
      res.status(400);
      res.json({
        code: "007",
        message: "Header not set. Please log in first"
      });
    }
}
