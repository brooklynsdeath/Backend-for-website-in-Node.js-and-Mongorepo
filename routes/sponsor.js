const router = require('express').Router();
//const passport = require('passport');
//const JwtStragety = require('passport-jwt').Strategy;
//const  ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Sponsor = require('../model/sponsor');


router.post('/sponsor', (req, res) => {
    const user = new Sponsor({
        _id: new mongoose.Types.ObjectId(),
        Fullname: req.body.Fullname,
        EmailAddress: req.body.EmailAddress,
        Contact: req.body.Contact,
        company: req.body.company
    });
    user.save().then(results => {
        console.log(results)
        res.status(201).json({
            message: "Thanks for sponsor us"
        })
    })
        .catch(err => {
            res.status(401).json({
                error: err,
                message: "something went wrong"
            })
        })
});

// get api

router.get('/sponsor:id', (req, res) => {
    Sponsor.findOne({_id: req.param.id})
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;
