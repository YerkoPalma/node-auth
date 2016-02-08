// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

var match = [ /^[a-zA-Z0-9][\w.-]*\@[a-zA-Z0-9][\w.-]*\.[\w]+$/, "el mail {VALUE} es invalido" ];

// define the schema for our user model
var userSchema = mongoose.Schema({

    token            : { type: String, unique: true },
    local            : {
        email        : { type: String, required: true, unique: true, uniqueCaseInsensitive: true, match: match },
        username     : { type: String, required: true },
        password     : { type: String, required: true, minlength: 5 }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.plugin(uniqueValidator, { message: 'El mail {VALUE} ya existe' });

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
