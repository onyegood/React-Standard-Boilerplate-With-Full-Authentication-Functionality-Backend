const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../../models/users/user');
const config = require('../../../config/config');
const LocalStrategy = require('passport-local');

// Create Local Strategy
const localOption = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOption, function(email, password, done) {
    // Verify this username and password, call done with user
    // if it is correct username and password
    // otherwise, call done with false

    User.findOne({email: email}, function(err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false)}

        // Compare passwords - is password equal to user.password
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err)}
            if (!isMatch) { return done(null, false)}

            return done(null, user);
        });
    })
});

// Setup options for JWT Strategies
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.sectret
};


// Create JWT Strategy 
const jwtLogin = new JWTStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exist in our database 
    // If it does, call 'done' with that user object
    // Otherwise, call 'done' without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err), false}
        if (user) { done(null, user)
        }else{ done(null, false) }
    });
});

// Ask passport to user the Strategy
passport.use(jwtLogin);
passport.use(localLogin);