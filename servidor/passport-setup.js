const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let options = {};
options.clientID = process.env.clientID;
options.secretID = process.env.secretID;
options.url = process.env.url;
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: options.clientID,
    clientSecret: options.secretID,
    callbackURL: options.url
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));