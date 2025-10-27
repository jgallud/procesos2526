const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;

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

passport.use(
    new GoogleOneTapStrategy(
        {
            //client_id:"xxxxxxx.apps.googleusercontent.com", //local
            client_id: options.clientID, //prod-oneTap
            //clientSecret: "xxxx", //local
            clientSecret: options.secretID,
            verifyCsrfToken: false, // whether to validate the csrf token or not
        },
        function (profile, done) {
            return done(null, profile);
        }
    )
);