const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

//---- Express Session Middleware ----//
app.use(
    session({
        secret: 'wild hog',
        resave: true,
        saveUnitialized: true
    })
);

//---- Express Messages Middleware ----//
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//---- Express validator Middleware ----//
app.use(
    expressValidator({
        errorFormatter: (param, msg, value) => {
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    })
);

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

//---- Bring in Routes files ----//
// Boats Routes
let boats = require('./routes/boats');
app.use('/boats', boats);
// User Routes
let users = require('./routes/users');
app.use('/users', users);

//---- Start Server ----//
app.listen(3000, () => {
    console.log('Server Started on Port 3000');
});
