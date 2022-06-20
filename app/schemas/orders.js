const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    order_id: String,
    name: String,
    email: String,
    phone: String,
    city: String,
    district: String,
    ward: String,
    address: String,
    notes: String,
    coupon: String,
    ship: String,
    ship_price: Number,
    discount: Number,
    products: String,
    status: { id: String, name: String},
    user_id: String,
    time: Date,
    modified: {
        user_id: Number, 
        user_name: String,
        time: Date,
    }
});
module.exports = mongoose.model('orders', schema);