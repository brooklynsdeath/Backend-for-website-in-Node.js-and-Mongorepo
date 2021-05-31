const mongoose = require('mongoose');


/*const intrestSchema = new mongoose.Schema({
  intrest:{
      type: String
  }
});*/

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: false
      },
    lastname:{
          type:String,
          required: false
    },  
      email: {
        type: String,
        required: true,
        unique: true,
        //match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      },
      password: {
        type: String,
        required: true,
        //match:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
      },
      /*intrest:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'intrest'
      }],*/
      intrest: [{
        type: String
      }],
      username: {
        type: String,
        required: true,
        unique: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      contact: {
        type: Number,
        required: true
      },
     /* profile:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
      }],
      date: {
        type: Date,
        default: Date.now
      }*/
      profileimg: {
        type: String
    }
    });

  

    module.exports = User = mongoose.model("User", UserSchema);
