const router = require('express').Router();
const mongoose = require('mongoose');
const event =require('../model/events');
const eventReg =require('../model/eventResgistration');
const csv = require('csv-parser');
const bodyparser =require('body-parser');
var multer = require('multer');
const fs = require('fs');

const { compress } = require('compress-images/promise');





router.use(bodyparser.urlencoded({
    extended: true
}))
router.use(bodyparser.json())
global.key=Date.now()
//let key = Date.now();
//const ukey =  function () {
//    return Date.now()
//}
//var key=ukey()
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'events/eventimg');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname+"-" + key+".jpg");
    }
});

const upload = multer({storage: storage});

router.post('/event-registration',async (req,res) => {
    const user = new eventReg({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        username: req.body.username,
        whatsapp: req.body.whatsapp,
        event_id: req.body.event_id,
        payment_status: req.body.payment_status,
        event_name: req.body.event_name
    });
    user.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Registration successful"
        });
    })
        .catch(err => {
            res.status(401).json({
                error: err,
                message: "something went wrong"
            })
        })
})

router.get('/event-display',async (req,res) => {
    const data= await event.find({});
    console.log(data);
    res.status(201).send(data);
})

router.post('/event-display',
    //upload.single('file') ,
    upload.fields([{
        name: 'file', maxCount: 1
    }, {
        name: 'files', maxCount: 1
    }]),
    (req, res) => {

        const processImages = async (onProgress) => {
            const result = await compress({
                source: 'events/eventimg/*'+key+'.jpg',
                destination: 'events/eventimg/'+'_',
                onProgress,
                enginesSetup: {
                    jpg: { engine: 'mozjpeg', command: ['-quality', '60']},
                }
            });

            const { statistics, errors } = result;

        };

        processImages((error, statistic, completed) => {
            if (error) {
                console.log('Error happen while processing file');
                console.log(error);
                return;
            }

            console.log('Sucefully processed file');

            console.log(statistic)
        });


        //global.key=Date.now();
    const object =  new event({
        _id: new mongoose.Types.ObjectId,
        name : req.body.name,
        organizer : req.body.organizer,
        about : req.body.about,
        description :req.body.description,
        venue : req.body.venue,
        date : req.body.date,
        eventimg: req.protocol+"://"+req.get('host')+"/images/_file-"+key+".jpg",
        organizerimg : req.protocol+"://"+req.get('host')+"/images/_files-"+key+".jpg",
        cost : req.body.cost
    });
    console.log(JSON.stringify(object));
    object.save()
        .then(result => {
            console.log(result);
            global.key=Date.now();
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })

});
router.get('/event-display/:name',async (req,res) => {
    const eventdata= await event.find({name: req.params.name});
    console.log(eventdata);
    res.header(200).json(eventdata);
})

router.get('/dashboard', async (req, res) =>{
    const eventdata= await eventReg.find({});
    console.log(eventdata);
    res.header(200).json(eventdata);
})

module.exports = router;
