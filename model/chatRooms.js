const mongoose = require('mongoose');


const chatRooms_schema = new mongoose.Schema({
    _id:mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        required: true
    },
    message: [{
        user : {
            type: String
        },
        message: {
            type: String
        }
    }]
});


module.exports = chatRooms = mongoose.model("chatRooms", chatRooms_schema);
