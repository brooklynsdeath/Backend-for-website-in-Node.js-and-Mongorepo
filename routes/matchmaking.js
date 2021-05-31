const router = require('express').Router();
const User = require('../model/model');
const {spawn} = require('child_process');
const fs = require('fs');

router.post('/matchmaking', async (req, res) => {
    const userid = req.body.uid;
    console.log(userid);
    try {
        const interest = await User.findOne({_id: req.body.uid});
        console.log(interest.intrest);
        var jsondata = await User.find();
        console.log(JSON.stringify(jsondata));
        fs.writeFileSync('./scripts/profile.json',JSON.stringify(jsondata));

        const convert = spawn('python3',['scripts/json_to_csv.py','scripts/profile.json','scripts/csvpro.csv']);
        convert.on('close', (code) => {
           console.log("file written successfully")
        });

        var data1=Array();
        const python = spawn('python3', ['scripts/matchmaking.py','scripts/csvpro.csv',userid.toString()]);
        python.stdout.on('data',async (data) => {
            console.log('Pipe data from python script ...');
            dataToSend = data.toString();
            data1=dataToSend.toString().split("\n");
            data1.pop();
            console.log(data1);
        });
        python.on('error',(err) => {
            console.log(err);
        })
        python.on('close',async (code) => {
            console.log(`child process close all stdio with code ${code}`);
            if(code===0){
                let match1=Array();
                for(let x in data1){
                    const d=await User.find({ _id: data1[x]});
                    match1.push(d[0]);
                }
                console.log(match1);
            }
        });
        /*converter(jsondata, (err, csv) => {
            if (err) {
                throw err;
            }
            // print CSV string
            console.log();
            // write CSV to a file
            fs.writeFileSync('./profiles.csv', csv);
        });*/



        const match = await User.find({intrest : { $in: interest.intrest } , _id: { $ne: req.body.uid } } );
        //interest should be in current users interest
        //it should match user with him/herself
        res.send(match);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
module.exports = router;
