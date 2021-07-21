# Encrypted-Timeseries Application
Service which is using Node runtime environment containerised inside docker,backend application which is generating and emit an encrypted data stream over a socket, listens to incoming data stream on a socket, decrypts and decodes it, save to a time series db and then emit the saved data to a small frontend app.

# Emitter service: 
    service generating a periodic data stream of encrypted messages where the number of encrypted strings can be anywhere between 49-499.
    Each message contains an object with 3 keys: name, origin, destination and a secret_key which is a hash of these 3 fields. randomize the values for name, origin, destination from a constant list provided in data.json file

```
exmaple

originalMessage = {
  name: 'Jack Reacher',
  origin: 'Bengaluru',
  destination: 'Mumbai'
}

add a secret_key by creating a sha-256 hash of the above object

sumCheckMessage = {
  name: 'Jack Reacher',
  origin: 'Bengaluru',
  destination: 'Mumbai',
  secret_key: "sha-256 ash of originalMessage",
}

encrypt this payload using encryption algorithm `aes-256-ctr` with a pass key

encryptedMessage = "encrypted message string"
```

the data stream is long string of `|` separated encrypted messages and look like this

"e84742dedd1ddc924e5bfe9a5d912a1918e217f98e5578d04fd5c12426022240|4bbf088f4fc646d7a65b1f84172a59f665a09beb226368ff53d46a5edfd75dc6|3743c3ff07694a3e5540dfc14d57dcfdd6868439f9b5b83162be9162d8032999|26ccd3d082227c49907af7d3e4f19aec764f73d20b73ca4337df818b68cf6975|8d5c45f45be31d657dd58ae4e2c8222f61a779ad11fe36da7b00511ac2b5c01a|e97451a0c72d4202915f6c43b48bc4c0a500851e4c71b66b51b3a588e6522316|99624125591ebecb2c4e34695bf8d1e8a36b73087fd0c8e6c4fad087fa244d5c|b70ed78f5befa9c64ecd9ddcb64f18868ba86debf6b833ce440bcb772be3171c|a9bec91a127fb7b76a462fadeac5090b8dc753841f1fd54ac758f4cdb9af5fc0|2c345c51005cd0b0df92b089dba17e82e321725f539b1cdfceebd6eab69c336a"

The emitter service is connecting to the listener service over sockets and periodically sending out a new message stream every 10s.

# Listener Service:
    The Listener service allow an emitter to connect to it via sockets. On receipt of the encrypted message stream, the listener is decrypting this string and retrieve the data in the payload. Validating the objects using the secret_key to ensure data integrity. If the data integrity of any object is compromised then, it is discarding that operation and moving on to the next in the queue.

    On successful object data integrity validation, adding a timestamp to that object and save it to a mongoDB collection modelled for saving time-series data where each document should be corresponding to the minute in which it is received. e.g. for data received for a person between 14:00 to 14:01 all records are added in a single document as a timeseries. Design the schema is such a manner to allow for optimal performance for aggregation timeseries queries.

# Frontend:
    All the valid data saved are displayed in a real-time manner on a small frontend app along with the success rate for data transmission and decoding


# Steps to run the code:

    # git clone the repository
    # run command: docker-compose up
    # on second terminal go to public folder using command : cd .\encrypted-timeseries\public\
    # on bash terminal run command : mongod
    # after going to this directory run command: node .\emmiter.js
    # for frontend app type : http://localhost:3000/ on browser and user will be able to see the data 
