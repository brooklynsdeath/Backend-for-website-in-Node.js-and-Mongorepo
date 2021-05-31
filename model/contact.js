const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
    Message: {
        type: String
    }

});

module.exports = contact = mongoose.model('contact ', contactSchema);