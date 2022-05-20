const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    title:String,
    description:String,
    status: String,
    ordering: Number,
    thumb: String,
    link: String,
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
module.exports = mongoose.model('sliders', schema);