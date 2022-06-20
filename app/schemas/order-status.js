const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    status: String,
    ordering: Number,
    icon: String,
    created: {
        user_id: Number, 
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: Number, 
        user_name: String,
        time: Date,
    }
});
module.exports = mongoose.model('order-status', schema);