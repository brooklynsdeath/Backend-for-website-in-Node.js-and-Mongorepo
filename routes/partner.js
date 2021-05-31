const router = require('express').Router();
const mongoose = require('mongoose');
const partner = require('../model/partner');



router.post("/partner",async (req,res) => {
    const user = new partner({
        _id: new mongoose.Types.ObjectId(),
        Fullname: req.body.Fullname,
        EmailAddress: req.body.EmailAddress,
        Contact: req.body.Contact,
        message: req.body.message
    });
    user.save().then(results => {
        console.log(results)
        res.status(201).json({
            message: "Thanks for partner     us"
        })
    })
        .catch(err => {
            res.status(401).json({
                error: err,
                message: "something went wrong"
            })
        })
})
module.exports = router;
