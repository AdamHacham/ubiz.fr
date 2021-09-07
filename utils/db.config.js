const mongoose = require('mongoose');

mongoose.connect(`mongodb://ubiz_root:tahadam.2106@ubiz.fr:27017/ubizStore`, { 
   tls: true,
   useNewUrlParser: true,
   useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
   console.log('Connected to MongoDB')
})

module.exports = mongoose.connection
