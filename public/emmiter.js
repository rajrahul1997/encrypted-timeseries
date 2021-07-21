const io = require("socket.io-client");
var socket = io('http://localhost:3000'); 
var sha256 = require('js-sha256')
const {randomIntFromInterval} = require('../utils/utils')
const {encrypt} = require('../utils/encryption')

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
    let encryptedMessage = encrypt(JSON.stringify(originalMessage))
    encryptedarray.push(encryptedMessage) 
}
    var datastream = encryptedarray.join('|');
    console.log(datastream)
    socket.emit('datastream', datastream);
}
setInterval(senddata,10000)