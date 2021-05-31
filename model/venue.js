const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
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
    venueDetails: {
        type: String
    }

});

module.exports = venue = mongoose.model('venue', venueSchema);