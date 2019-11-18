const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) =>{
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user exists in database
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser) {
                done(null, currentUser);
            } else {
                console.log(profile);
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    isAdmin: false
                }).save().then((newUser) => {
                    console.log('New User registered: ' + newUser);
                    done(null, newUser);
                });
            }
        });
    })
)
