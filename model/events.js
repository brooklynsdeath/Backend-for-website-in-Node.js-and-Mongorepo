const mongoose = require('mongoose');

const eventSchema= new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    name : {
        type: String,
        required: true,
        unique: true
    },

    organizer : {
        type: String,
        required: true
    },

    about : {
        type: String,
        required: true
    },

    description : {
        type: String,
        required: true
    },

    venue : {
        type: String,
        required: true
    },

    date : {
        type: Date,
        required: true
    },

    eventimg: {
        type: String
    },

    organizerimg : {
        type: String
    },

    cost : {
        type: Number
    }
});
module.exports = events = mongoose.model("events", eventSchema);
