const router = require('express').Router();
const mongoose = require('mongoose');
const contact = require('../model/contact');



router.post('/contact', (req, res) => {
    const user = new contact({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        Fullname: req.body.Fullname,
        EmailAddress: req.body.EmailAddress,
        Contact: req.body.Contact,
        Message: req.body.Message
    });
    user.save().then(results => {
        console.log(results)
        res.status(201).json({
            message: "Thanks for contacting us"
        })
    })
        .catch(err => {
            res.status(401).json({
                error: err,
                message: "something went wrong"
            })
        })
});

router.get('/contact:email', (req, res) => {
    contact.findOne({email: req.param.email})
        .then(result => {
            res.send(result);
        }).catch(err => {
        console.log(err);
    })
})
module.exports = router;
