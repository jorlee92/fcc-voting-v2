var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    //Each user requires an email address that does not already exist in the DB, and a password. 
    email:{
        type: String,
        unique: true, 
        required: true, 
    },
    password:{
        type:String, 
        required: true
    }
})
UserSchema.statics.authenticate = (email, password, callback) => {
    //This doesnt use ES6 syntax for any particular reason. 
    //Given an email and password this will find a user with a matching email address and check a hash of the provided password 
    //with the hash stored in the database. 
    User.findOne({email:email}).exec((err, user) => {
        if(err){
            return callback(err)
        }
        else if (!user){
            let err = new Error("Could not find user");
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user);
            }
            else{
                return callback(null, false);
            }
        })
    })
}

UserSchema.pre('save', function(next){
    //This will happen before any user is created. 
    //This takes the password that would be inserted into the DB and hashes it, the hashed password is then inserted into the DB. 
    var user = this;
    bcrypt.hash(user.password, 12, function(err, result){
        if (err) {
            console.log("Failed to hash password");
            return next(err);
        }
        user.password = result; 
        next();
    });
});


var User = mongoose.model('User', UserSchema);
module.exports = User; 