# Backend-for-website-in-Node.js-and-Mongorepo

Our Model-
We in the backend using many schemas to store data in our database using node.js as a backend JavaScript language.
In bitbucket under MongoRepo  Model section there are all the schemas:
•	Contact.js
•	Eventregistration.js
•	Event.js
•	Intrest.js
•	Model.js
•	Partner.js
•	Payment_schema.js
•	Profile.js
•	Speaker.js
•	Sponser.js
•	Venue.js



Sample schema-
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    _id:mongoose.SchemaTypes.ObjectId,
    Fullname: {
        type : String
    },
    EmailAddress : {
        type: String
    },
    Contact: {
        type: String
    },
    Message: {
        type: String
    }

});

module.exports = contact = mongoose.model('contact ', contactSchema);

It’s a contact.js schema in this, the details of the user are taken while contacting to the company (Comunev) like
•	Full name
•	Email address
•	Contact
•	Message


In MongoRepo  Events
All the details of the events on company’s website are directed from events section as the data.csv file is stored here, in which details of each events are written in Comma Separated Values.

Sample-
About2,Location2,Organizer2,Description2,Event2,Date2,100,#,app\eventImages\event-Image.jpg,app\eventImages\organiserImg.jpg

In this the detail of events are as follow-
•	About the event
•	Location
•	Organizer
•	Description
•	Event2 = name of the event
•	Date
•	Fees
•	Images for event


App.js file
This is the main file of our web site as the user.js file is also linked with it.
In this file 
•	User.js file
•	Chat feature
•	Database connections
o	Using env file
•	Payment 
o	Order
o	Verify
o	Transaction details

var io = require('socket.io').listen(9000);

io.sockets.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        chatRooms.find({}).toArray((err, rooms) => {
            if(err){
                console.log(err);
                return false;
            }
            count = 0;
            rooms.forEach((room) => {
                if(room.name == data.room){
                    count++;
                }
            });
            if(count == 0) {
                chatRooms.insert({ name: data.room, messages: [] });
            }
        });
    });
    socket.on('message', (data) => {
        io.in(data.room).emit('new message', {user: data.user, message: data.message});
        chatRooms.update({name: data.room}, { $push: { messages: { user: data.user, message: data.message } } }, (err, res) => {
            if(err) {
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


Socket.io
We’re using 9000 port for chat feature in socket.io.
List collection 
is the list of your friends in your friend list.
Connection
	The user has connected to the server.
	The list will be updated.  
	User id generated.
	User has disconnected from the server.
	Friend list changed

Routes
	User.js file
In this file all the data are extracted from the frontend and send to the database  
•	Login 
•	Signup
•	Forget password
•	Interest id
•	Profile photo
•	Sponsor
•	Contact
•	Speaker 
•	Matchmaking 
•	Event 
o	Registration
o	display

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

