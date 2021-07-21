const io = require("socket.io-client");
var socket = io('http://localhost:3000'); 
var sha256 = require('js-sha256')
const {randomIntFromInterval} = require('../utils/utils')
const {encrypt} = require('../utils/encryption')

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
    var maximumlen = randomIntFromInterval(49,499)
    let encryptedarray = [];
    for(let i = 49;i<=maximumlen;i++){
        var max1= data.names.length
        var max2 = data.cities.length
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
    // console.log(originalMessage);
    let encryptedMessage = encrypt(JSON.stringify(originalMessage))
    encryptedarray.push(encryptedMessage) 
}
    // console.log(encryptedarray);
    var datastream = encryptedarray.join('|');
    console.log(datastream)
    socket.emit('datastream', datastream);
}
setInterval(senddata,10000)