const mongoose = require('mongoose');

//---- Boat Schema ----//
const BoatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    engine: { type: String, required: true },
    crew: { type: Number, required: true },
    guest: { type: Number, required: true }
});

module.exports = mongoose.model('Boat', BoatSchema);
