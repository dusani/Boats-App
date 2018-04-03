const express = require('express');
const path = require('path');

//---- Init App ----//
const app = express();

//---- Load View Engine ----//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//---- Routes ----//
// Home Route
app.get('/', (req, res) => {
    let boats = [
        {
            id: 1,
            name: 'Boat 1',
            year: '2017',
            engine: '2000 HP',
            crew: '2',
            guest: '7'
        },
        {
            id: 2,
            name: 'Boat 2',
            year: '2018',
            engine: '2400 HP',
            crew: '3',
            guest: '9'
        },
        {
            id: 3,
            name: 'Boat 3',
            year: '2016',
            engine: '1900 HP',
            crew: '2',
            guest: '6'
        }
    ];
    res.render('index', {
        title: 'Boats',
        boats: boats
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
