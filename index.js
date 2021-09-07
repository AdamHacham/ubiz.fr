const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
require('./utils/db.config')
const MongoStore = require('connect-mongo')(session)
const mongoDbConnection = require('./utils/db.config')
const passport = require('passport')
require('./utils/authStrategies/localStrategie')
const authMiddleware = require('./middlewares/authMiddleware')
const authRoutes = require('./routes/authRoutes')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// app.set('trust proxy' ,1)

app.use(session({
  secret: 'db74f661bc4e3fbc683b5e28c32f2185f39934a4d2f9283559',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoDbConnection })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', authRoutes)

app.get('/', (req, res) => {
  console.log('User:', req.user)
  return res.render('index')
})

app.get('/homepage', authMiddleware, (req, res) => {
  res.send(`welcome ${req.user.lastname}`)
})

app.listen(3000, () => {
  console.log('server running at port 3000')
})

module.exports = app
