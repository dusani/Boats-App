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

//---- Routes ----//
// Home Route
app.get('/', (req, res) => {
    Boat.find({}, (error, boats) => {
        if (error) {
            throw err;
        } else {
            res.render('index', {
                title: 'Boats',
                boats: boats
            });
        }
    });
});

app.get('/boats/add', (req, res) => {
    res.render('add_boat', {
        title: 'Add Boats'
    });
});

//---- Start Server ----//
app.listen(3000, () => {
    console.log('Server Started on Port 3000');
});
