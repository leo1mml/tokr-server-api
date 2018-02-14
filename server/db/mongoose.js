var mongoose = require('mongoose')
var options = {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
  };
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, options)

module.exports = {
    mongoose
}