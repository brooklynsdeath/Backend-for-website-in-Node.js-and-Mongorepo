const router = require('express').Router();
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const flash = require('flash-messages');
//const passport = require('passport');
//const JwtStragety = require('passport-jwt').Strategy;
//const  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/model');
const mongoose = require('mongoose');
const ensure = require('../middleware/auth');
const intrest = require('../model/intrest');
const profile = require('../model/profile');
const Sponsor = require('../model/sponsor');
const contact = require('../model/contact');
const speaker = require('../model/speaker');
const venue = require('../model/venue');
const event =require('../model/events');
const partner = require('../model/partner');
const eventReg =require('../model/eventResgistration');
const csv = require('csv-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

global.key=Date.now()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, "profile-"+key+".jpg");
    }
});

const upload = multer({storage: storage});

router.get("/", async (req, res) => {
    try {
        const model = await User.find()
        res.send(model)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post("/verifyotp",async (req,res) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (user === null) {
                console.log(user);
                return res.status(409).json({
                    message: "Mail doesn't exists"
                });
            }
        });
    const email = req.body.email;
    let otp = Math.floor(Math.random()*1000000);

    console.log(otp+"  :: otp");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'admin@gmail.com',
            pass: '*******'
        }
    });

    const mailOptions = {
        from: 'admin@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'your otp to reset password is : ' + otp
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.header(501).json(
                {
                    "message": "error in sending mail",
                    "error": error
                });
        } else {
            console.log('Email sent: ' + info.response);
            res.header(200).json({
                "otp": otp
            })
        }
    });
});


router.post("/forgotPassword",async (req,res) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (user === null) {
                console.log(user);
                return res.status(409).json({
                    message: "Mail doesn't exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                            User.findOneAndUpdate({email: req.body.email},{$set : {password: hash}})
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "Password Updated"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        }).catch(err => {
            console.log(err);
            res.send(err);
    });

})
router.post("/signup", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                            intrest: req.body.intrest,
                            city: req.body.city,
                            country: req.body.country,
                            contact: req.body.contact
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post("/login", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        'secret',
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        response: user[0]
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:userId", (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/intrest:id', (req, res) => {
    intrest.save().then(results => {
        console.log(results);
        res.status(201).json({
            message: "intrest created"
        })
    }).catch(err => {
        console.log(err);
        res.status(401).json({
            error: err
        });
    });
});


router.get('/intrest:id', (req, res) => {
    intrest.findOne({_id: req.param.id})
        .populate('intrest')
        .then(intrests => {
            res.json(intrests);
        }).catch(err => {
        console.log(err);
        res.status(404).json({
            error: err,
            message: 'not found'
        });
    });
});

router.get('/signup/profile/:id', (req, res) => {
    User.findOne({_id: req.params.id})
        .populate('Profile')
        .then(profiles => {
            res.json(profiles)
        }).catch(err => {
        console.log(err);
        res.status(404).json({
            error: err,
            message: 'not found'
        });
    });
});
router.post('/profile/photo', upload.single('profile'), (req, res, next) => {
    console.log("abc")
    try {
        User.findOneAndUpdate({_id: req.body._id},{$set : {profileimg: req.protocol+"://"+req.hostname+"/"+"profile-"+key+".jpg"}})
        .then(
            result => {
            console.log(result);
            res.status(201).json({
                message: "Profile Image Updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        //res.send(req.file);
    } catch {
        res.status(400);
    }
});
// update api
router.put('/signup/profile/:id', (req, res) => {
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        intrest: req.body.intrest,
        image: req.body.image
    }
    User.findOneandUpdate({_id: req.param.id}, user, (req, res) => {
        if (err) {
            res.status(401).json({
                error: err,
                message: 'cannot be updated'
            })
        }
        res.status(201).json({
            message: "user updated"
        })
    })
});

module.exports = router;
