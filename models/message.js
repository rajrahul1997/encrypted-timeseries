const mongoose = require('mongoose');
const Message = mongoose.model('Message', new mongoose.Schema({
    data:{
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
}));
module.exports.Message= Message