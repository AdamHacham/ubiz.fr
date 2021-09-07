const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
require('./utils/db.config')

const authRoutes = require('./routes/authRoutes')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

//app.set('trust proxy' ,1)

app.use(session({
  secret: 'db74f661bc4e3fbc683b5e28c32f2185f39934a4d2f9283559',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', authRoutes)

app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1
  console.log(`Tu as visité ${req.session.views} times`)
  return res.render('index')
})

app.listen(3000, () => {
  console.log('server running at port 3000')
})

module.exports = app
