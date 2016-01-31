// load up the user model
var User       = require('../app/models/user');

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
                  res.json(req.user);
                }
            });
        });
    });

    app.post('/signup', function(req, res){
      //get user data
      //find the user
      var email = req.body.email;
      var password = req.body.password;

      var user = {
        local : {
          email: email,
          password: password
        }
      }
      
      //check user data

      //all fine, save the user
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send({ success : false, message : 'authentication failed' });
}
