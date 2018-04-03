const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Bring in Boats Model
let Boat = require('./models/boat');

mongoose.connect('mongodb://user:admin@ds161443.mlab.com:61443/boats');

//---- Init App ----//
const app = express();

//---- Load View Engine ----//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//---- Middleware ----//
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'client')));

//---- Routes ----//
// Home Route
app.get('/', (req, res) => {
    Boat.find({}, (error, boats) => {
        if (error) {
            throw error;
        } else {
            res.render('index', {
                title: 'Boats',
                boats: boats
            });
        }
    });
});

// Get Single Boat
app.get('/boat/:id', (req, res) => {
    Boat.findById(req.params.id, (error, boat) => {
        if (error) throw error;

        res.render('boat', {
            boat: boat
        });
    });
});

// Add Route
app.get('/boats/add', (req, res) => {
    res.render('add_boat', {
        title: 'Add Boats'
    });
});

// Add Submit POST Route
app.post('/boats/add', (req, res) => {
    // console.log('Submitted');
    let boat = new Boat();
    boat.name = req.body.name;
    // console.log(req.body.name);
    boat.year = req.body.year;
    boat.engine = req.body.engine;
    boat.crew = req.body.crew;
    boat.guest = req.body.guest;

    boat.save(error => {
        if (error) throw error;

        res.redirect('/');
    });
});

// Load Edit Form
app.get('/boat/edit/:id', (req, res) => {
    Boat.findById(req.params.id, (error, boat) => {
        if (error) throw error;

        res.render('edit_boat', {
            title: 'Edit Boat',
            boat: boat
        });
    });
});

// Update Edit Boat
app.post('/boats/edit/:id', (req, res) => {
    let boat = {};
    boat.name = req.body.name;
    boat.year = req.body.year;
    boat.engine = req.body.engine;
    boat.crew = req.body.crew;
    boat.guest = req.body.guest;

    let query = { _id: req.params.id };

    Boat.update(query, boat, error => {
        if (error) throw error;

        res.redirect('/');
    });
});

app.delete('/boat/:id', (req, res) => {
    let query = { _id: req.params.id };

    Boat.remove(query, error => {
        if (error) throw err;

        res.send('Sucess');
    });
});

//---- Start Server ----//
app.listen(3000, () => {
    console.log('Server Started on Port 3000');
});
