const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors")
const transaction = require('./model/payment_schema');
const https = require('https');
const fs = require('fs');
const chatRooms = require('./model/chatRooms');
var Razorpay = require("razorpay");
const port = 5000;
const app = express();
app.use(cors());


/*const options = {
    key: fs.readFileSync("/opt/ssl_keys/key.pem"),
    cert: fs.readFileSync("/opt/ssl_keys/cert.pem")
};*/

let instance = new Razorpay({
    key_id: 'your id', // your `KEY_ID`
    key_secret: 'your key' // your `KEY_SECRET`
})

// middleware 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//routes
const router = require('./routes/user');
const speaker = require('./routes/speaker');
const match = require('./routes/matchmaking');
const event = require('./routes/event');
const contact = require('./routes/contact');
const sponsor = require('./routes/sponsor');
const partner = require('./routes/partner');
app.use('/api', router);
app.use('/api', speaker);
app.use('/api', match);
app.use('/api', event);
app.use('/api', contact);
app.use('/api', sponsor);
app.use('/api', partner);

app.use('/images' ,express.static('./events/eventimg'));
app.use('/profile',express.static('./uploads'));
//const chat = require('./routes/chat_func');
//app.use('/chat',chat);

var io = require('socket.io').listen(9000);

//db connectivity
require('dotenv').config();
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('database is connected!!'))
    .catch(err => console.log(err));

io.sockets.on('connection', (socket) => {
    socket.on('join', async (data) => {
        socket.join(data.room);
        console.log(data);
        let rooms = await chatRooms.find({name: data.room});
        console.log("rooms : " + JSON.stringify(rooms));
        console.log(JSON.stringify(rooms).length)
        if (JSON.stringify(rooms).length == 2) {
            const t = new chatRooms({
                _id: new mongoose.Types.ObjectId(),
                name: data.room,
                message: []
            });
            t.save()
                .then(data => {
                    console.log(data);
                }).catch(err => {
                console.log(err)
            });
            console.log("room inserted");
        }
    });
    socket.on('message', async (data) => {
        console.log(data.message);
        io.in(data.room).emit('new message', {user: data.user, message: data.message});
        await chatRooms.update({name: data.room}, {
            $push: {
                message: {
                    user: data.user,
                    message: data.message
                }
            }
        }, (err, res) => {
            if (err) {
                console.log(err);
                return false;
            }
            console.log("Document updated");
        });
    });
    socket.on('typing', (data) => {
        socket.broadcast.in(data.room).emit('typing', {data: data, isTyping: true});
    });
});

//chat room api

app.get('/api/chatroom/:room', async (req, res) => {
    let room = req.params.room;
    const data = await chatRooms.find({name: room});
    console.log(data);
    res.json(data);
});


// server listening
app.post("/api/payment/order", (req, res) => {
    params = req.body;
    instance.orders.create(params).then((data) => {
        res.send({"sub": data, "status": "success"});
    }).catch((error) => {
        res.send({"sub": error, "status": "failed"});
    })
});


app.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'sRLbjhVqfxVhsAMeuDcGKAkE')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = {"status": "failure"}
    if (expectedSignature === req.body.razorpay_signature)
        response = {"status": "success"}

    const record = new transaction({
        email: req.body.email,
        userid: req.body.userid,
        payment_id: req.body.razorpay_payment_id,
        order_id: req.body.razorpay_order_id,
        status: response.status,
        time: Date.now()    //if date is sent from the front end use req.body.date
    }).save()
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log(err.msg);
        })

});

app.listen(port, () => {
    console.log(`the service is running on ${port}`)
});

/*https.createServer(options,app).listen(port,()=>{
    console.log(`the service is running on ${port}`);
});*/
