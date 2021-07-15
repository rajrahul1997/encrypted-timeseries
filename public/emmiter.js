const io = require("socket.io-client");
var socket = io('http://localhost:3000'); 
var sha256 = require('js-sha256')
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'raj123';

// var message = document.getElementById('msg');
//     handle = document.getElementById('handle');
//     btn = document.getElementById('send');
//     output = document.getElementById('output');

//     btn.addEventListener('click', function(){
//         socket.emit('encryptedMessage ', {
//             message: message.value,
//             handle: handle.value
//         });
//       });

// socket.on('encryptedMessage ',function(originalMessage){
// output.innerHTML += '<p><strong>' + originalMessage.handle + ': </strong>' + originalMessage.message + '</p>';
// })


var data = require('../data.json')

function senddata(){
    var max1= data.names.length
    var max2 = data.cities.length
    // console.log(max1, max2)
    function value(max) {
        return Math.floor(Math.random() * max);
    }
    var originalMessage = {
        name: `${data.names[value(max1)]}`,
        origin: `${data.cities[value(max2)]}`,
        destination: `${data.cities[value(max2)]}`
    }
    let hash = sha256(JSON.stringify(originalMessage))
    originalMessage["secret_key"] = hash
    // console.log(originalMessage)
    
    function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }
    //console.log(encrypt(JSON.stringify(originalMessage)))
    let encryptedMessage = encrypt(JSON.stringify(originalMessage))
    // console.log(encryptedMessage)

    socket.emit('encryptedMessage', encryptedMessage);
}
setInterval(senddata,10000)