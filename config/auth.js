// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : 'your-secret-clientID-here', // your App ID
        'clientSecret'    : 'your-client-secret-here', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '724523207929-li9j3124v7j5nra1n6tipvu0qa0uuuvv.apps.googleusercontent.com',
        'clientSecret'     : '_nP-pLnNaOMH8j7DYNtn4wak',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
