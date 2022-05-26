const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    slug: String,
    status: String,
    ordering: Number,
    menulv1: Array,
    menulv2: Array,
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
module.exports = mongoose.model('menulv3', schema);