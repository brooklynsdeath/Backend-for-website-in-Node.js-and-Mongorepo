const mongoose = require('mongoose');

const RegSchema= new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    name : {
        type: String,
        required : true
    },
    event_name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    whatsapp : {
        type: Number,
        required: true
    },
    event_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    payment_status : {
        type: String,
        required: true,
        default: 'pending'
    }
})

module.exports = Registration = mongoose.model("Registration", RegSchema);
