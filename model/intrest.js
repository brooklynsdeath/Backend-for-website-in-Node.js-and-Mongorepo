const mongoose = require('mongoose');

const intrestSchema = new mongoose.Schema({
    intrest:[{
        type: String
    }]
});


module.exports = intrest = mongoose.model('intrest', intrestSchema);