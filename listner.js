var express = require('express');
var socket = require('socket.io');
const Message = require('./models/message').Message;
const mongoose = require('mongoose')

// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
var sha256 = require('js-sha256')
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'raj123';


var app = express();
var server = app.listen(3000, function () {
    console.log('listening at http://localhost:3000')
})

app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1', { useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true,
  autoIndex: true
});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

var io = socket(server);
io.on('connection',function (socket){
    // console.log("Socket Connection",socket.id);
    socket.on('encryptedMessage',  async function decrypt(encryptedMessage){
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(encryptedMessage,'hex','utf8')
        dec += decipher.final('utf8');
        dec = JSON.parse(dec)
        // console.log('dec:',dec);
        var checkobj = {}
        checkobj['name'] =dec.name;
        checkobj['origin'] =dec.origin;
        checkobj['destination'] =dec.destination;
        let hash = sha256(JSON.stringify(checkobj))
        console.log(compare(hash, dec.secret_key))
        const timestamp = Math.floor(Date.now()/1000); //unix timestamp in seconds
        checkobj["timestamp"] = timestamp
        console.log('checkobj:',checkobj)
        // await databaseentry(checkobj)
    }) 
});


function compare(str1,str2){
    var success = 0;
    var failure = 0;
    if(str1 == str2){
        success ++
    }else{
        failure ++
    }
    var sucessrate = ((success/(success+failure))*100)
    return (sucessrate)
}

// async function databaseentry(obj) {
//     let { name,origin,destination,timestamp } = obj;
//     // if(!name || !origin || !destination || !timestamp) return res.status(400).json({error: 'Invalid params!'});
//     let message  = await Message.create({name,origin,destination,timestamp});
// }















