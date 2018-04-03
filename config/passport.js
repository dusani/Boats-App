const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('./database');
const bcrypt = require('bcryptjs');

module.exports = passport => {
    // Local Strategy
    passport.use(
        new LocalStrategy((username, password, done) => {
            // Match username
            let query = { username: username };
            User.findOne(query, (error, user) => {
                if (error) throw error;

                if (!user) {
                    return done(null, false, { message: 'No User Found' });
                }

                // Match Password
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if (error) throw error;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    });
};
