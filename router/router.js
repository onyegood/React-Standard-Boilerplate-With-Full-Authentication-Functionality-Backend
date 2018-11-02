const AuthController = require('../controllers/auth/authController');
const passportService = require('../controllers/auth/passport');
const passport = require('passport');

// Protected route (user must be loggin to access any route that uses this)
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function(app) {
   app.post('/signup', AuthController.signup);
   app.post('/signin', requireSignin, AuthController.signin);
}