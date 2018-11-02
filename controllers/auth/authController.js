const User = require('../../models/users/user');
const jwt = require('jwt-simple');

const config = require('../../config/config');

function generateTokenForUser(user) {
    const timestamp = new Date().getTime();

    return jwt.encode({sub: user._id, iat: timestamp}, config.sectret);
}
exports.signup = function name(req, res, next) {
    // Get access to request body
    const email = req.body.email;
    const password = req.body.password;

    //Check for empty entry
    if (!email) return res.status(422).send({success: false, error: 'Email is required'});
    if (!password) return res.status(422).send({success: false, error: 'Password is required'});


    // See if a user with the given email exist
    User.findOne({email: email}, function(err, existingUser) {
        //Check if random error occoured
        if (err) { return next({success: false, error: err})}

        // If a user with email does exist, return error
        if (existingUser) {
            return res.status(422).send({success: false, error: 'Email is in used'});
        }
        
        // if a user with email does not exist, create and save record
        const user = new User({
            email: email,
            password: password
        });
        
        user.save(function(err) {
            if (err) { return next({success: false, error: err})};
            res.json({
                success: true, 
                message: 'User created successfully!', 
                token: generateTokenForUser(user)
            });
        });
    });
};

exports.signin = function(req, res, next) {
    res.send({token: generateTokenForUser(req.user)});
}