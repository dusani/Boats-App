const express = require('express');
const router = express.Router();

// Bring in Boats Model
let Boat = require('../models/boat');
// Bring in User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthentication, (req, res) => {
    res.render('add_boat', {
        title: 'Add Boat'
    });
});

// Add Submit POST Route
router.post('/add', (req, res) => {
    // Adding validation to our form fields
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('year', 'Year is required').notEmpty();
    req.checkBody('engine', 'Engine is required').notEmpty();
    req.checkBody('crew', 'Crew is required').notEmpty();
    req.checkBody('guest', 'Guest is required').notEmpty();

    // get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_boat', {
            title: 'Add Boat',
            errors: errors
        });
    } else {
        let boat = new Boat();
        boat.name = req.body.name;
        // console.log(req.body.name);
        boat.year = req.body.year;
        boat.engine = req.body.engine;
        boat.crew = req.body.crew;
        boat.guest = req.body.guest;
        boat.author = req.user._id;

        boat.save(error => {
            if (error) {
                throw error;
            } else {
                req.flash('success', 'Boat Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthentication, (req, res) => {
    Boat.findById(req.params.id, (error, boat) => {
        if (boat.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        if (error) throw error;

        res.render('edit_boat', {
            title: 'Edit Boat',
            boat: boat
        });
    });
});

// Update Edit Boat
router.post('/edit/:id', (req, res) => {
    let boat = {};
    boat.name = req.body.name;
    boat.year = req.body.year;
    boat.engine = req.body.engine;
    boat.crew = req.body.crew;
    boat.guest = req.body.guest;

    let query = { _id: req.params.id };

    Boat.update(query, boat, error => {
        if (error) throw error;

        req.flash('success', 'Boat Updated');
        res.redirect('/');
    });
});

// Delete a Boat
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = { _id: req.params.id };

    Boat.findById(req.params.id, (error, boat) => {
        if (baot.author != req.user._id) {
            res.status(500).send();
        } else {
            Boat.remove(query, error => {
                if (error) throw err;

                res.send('Success');
            });
        }
    });
});

// Get Single Boat
router.get('/:id', (req, res) => {
    Boat.findById(req.params.id, (error, boat) => {
        User.findById(boat.author, (error, user) => {
            if (error) throw error;

            res.render('boat', {
                boat: boat
            });
        });
    });
});

// Access Control
function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports = router;
