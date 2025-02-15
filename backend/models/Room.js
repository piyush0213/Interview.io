const mongoose = require('mongoose');
const {Schema} = mongoose;

const RoomsSchema = new Schema({
    roomID:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Rooms', RoomsSchema);