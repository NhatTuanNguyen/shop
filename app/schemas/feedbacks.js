const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: String,
    email: String,
    subject: String,
    message: String,
    createdTime:Date,
});
module.exports = mongoose.model('feedbacks', schema);