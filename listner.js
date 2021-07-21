var express = require('express');
var socket = require('socket.io');
const Message = require('./models/message').Message;
const mongoose = require('mongoose')
const {compare} = require('./utils/utils')
var sha256 = require('js-sha256')
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'raj123';

var app = express();
var server = app.listen(3000, function () {
    console.log('listening at http://localhost:3000')
})

app.use(express.static('public'));

mongoose.connect('mongodb://mongo', { useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true,
  autoIndex: true
});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

var io = socket(server);
var lastminute = undefined;
io.on('connection',function (socket){
    console.log("Socket Connection",socket.id);
    try {
        socket.on('datastream',   async function decrypt(datastream){
            var datastreamsubstring = datastream.split('|');
            var databasedocument = [];
            for (let eachmessage of datastreamsubstring){
                var decipher = crypto.createDecipher(algorithm,password)
                var dec = decipher.update(eachmessage,'hex','utf8')
                dec += decipher.final('utf8');
                dec = JSON.parse(dec)
                var checkobj = {}
                checkobj['name'] =dec.name;
                checkobj['origin'] =dec.origin;
                checkobj['destination'] =dec.destination;
                var hash = sha256(JSON.stringify(checkobj))
                var sucessrate = compare(hash, dec.secret_key)
                var d = new Date()
                var m = d.getMinutes()
                if (lastminute == undefined){
                    lastminute = m
                }
                databasedocument.push(checkobj)
                var data = JSON.stringify(databasedocument)
                const t = new Date()
                var timestamp = Math.floor(t.getTime() / 60000)
                var message = {}
                message['data'] = data
                message['timestamp'] = timestamp
            }
            if(lastminute !== m){
                var result = await Message.create(message);
                lastminute = m;
            }
            console.log(result)
            io.emit('Frontend_Topic',{result,sucessrate})
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({error: 'Server Error!'});
    }
});
