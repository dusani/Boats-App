const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Process
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req
        .checkBody('password2', 'Passwords do not match')
        .equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
                if (error) throw error;

                newUser.password = hash;
                newUser.save(error => {
                    if (error) throw error;

                    req.flash('success', 'You are now registed and can log in');
                    res.redirect('/users/login');
                });
            });
        });
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
    req.logout('/');
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
