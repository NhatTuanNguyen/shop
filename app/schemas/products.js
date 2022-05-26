const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    slug: String,
    status: String,
    special: String,
    ordering: Number,
    price: Number,
    reduce_price: Number,
    description: String,
    thumb: String,
    menulv1: Array,
    menulv2: Array,
    menulv3: Array,
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
module.exports = mongoose.model('products', schema);