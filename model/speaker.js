const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
    _id:mongoose.SchemaTypes.ObjectId,
    Fullname: {
        type : String
    },
    EmailAddress : {
        type: String
    },
    Contact: {
        type: String
    },
   LinkedinProfile: {
        type: String
    }

});

module.exports = speaker  = mongoose.model('speaker', speakerSchema);