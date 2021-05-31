const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: true
    }

})







module.exports = partner = mongoose.model('partner', partnerSchema);
