const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    logo: String,
    media: Array,
    copyright: String,
    info: String,
    map: String,
    email: String,
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
module.exports = mongoose.model('settings', schema);