const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    Images:{
        type: Object,
    }
});

module.exports = Profile = mongoose.model("Profile", profileSchema);