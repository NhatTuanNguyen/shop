const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    email: {
        type: String,
        unique: true,
    },
    phone: String,
    password: String,
    status: String,
    ordering: Number,
    avatar: String,
    city: String,
    district: String,
    ward: String,
    address: String,
    group: {
        id: String,
        name: String,
    },
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
module.exports = mongoose.model('users', schema);