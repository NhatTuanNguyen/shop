const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    status: String,
    amount: Number,
    remain: Number,
    discount: Number,
    min_price: Number,
    type: String,
    starttime:Date,
    endtime:Date,
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
module.exports = mongoose.model('coupons', schema);