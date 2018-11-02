const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

//Define a model 
const userSchema = Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
})

//Bcrypt password
// Before saving a model run this function
userSchema.pre('save', function(next) {
    // Get access to user model
    const user = this;

    // Generate a salt then run callback
    bcrypt.genSalt(10, function name(err, salt) {
        if(err) { return next(err); }        
        // Hash(encrypt) our password using salt
        bcrypt.hash(user.password, salt, null, function name(err, hash) {
            if (err) { return next(err); };
            // Overwrite plan text password with encrypted password
            user.password = hash;
            next();
        });
    });
});

//Password comparisim helper 
userSchema.methods.comparePassword = function(userPassword, callback) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) { return callback(err)};

        callback(null, isMatch);
    });
}


//Create a model class
const UserModelClass = mongoose.model('user', userSchema);

//Export our model
module.exports = UserModelClass;
