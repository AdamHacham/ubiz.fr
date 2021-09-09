const mongoose = require('mongoose');
const config = require('./config')

mongoose.connect(config.mongoUrl, {
   tls: true,
   useNewUrlParser: true,
   useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
   console.log('Connected to MongoDB')
})

module.exports = mongoose.connection
