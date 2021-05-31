const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    _id:mongoose.SchemaTypes.ObjectId,
    Fullname: {
        type : String,
        required: true
    },
    EmailAddress : {
        type: String,
        required: true
    },
    Contact:{
        type: Number,
        minlength: 10,
        required: true
    },
    company: {
        type: String,
        required: true
    }
});


module.exports = Sponsor = mongoose.model('sponsor', sponsorSchema);
