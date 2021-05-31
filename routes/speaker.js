const router = require('express').Router();
const mongoose = require('mongoose');
const speaker = require('../model/speaker');



router.post('/speaker', (req, res) => {
    const user = new speaker({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        Fullname: req.body.Fullname,
        EmailAddress: req.body.EmailAddress,
        Contact: req.body.Contact,
        LinkedinProfile: req.body.LinkedinProfile
    });
    user.save().then(results => {
        console.log(results)
        res.status(201).json({
            message: "Thanks for contacting  us"
        })
    })
        .catch(err => {
            res.status(401).json({
                error: err,
                message: "something went wrong"
            })
        })
});

module.exports = router;
