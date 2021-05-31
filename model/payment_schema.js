const mongoose = require('mongoose');

const trans_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    time :{
        type: Date,
        required: true
    }
});

module.exports = transaction = mongoose.model("transaction", trans_schema);
