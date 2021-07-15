const mongoose = require('mongoose');
const Message = mongoose.model('Message', new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    origin: {
        type: String,
        required: true,   
    },
    destination: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true,
    },
}));
module.exports.Message= Message