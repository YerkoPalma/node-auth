// config/database.js
module.exports = {

    'url' : 'mongodb://localhost/passport', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'test' : 'mongodb://localhost/test',
    'wercker': 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/test'

};
