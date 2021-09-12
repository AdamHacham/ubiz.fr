require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const logger = require('morgan')
require('./utils/db.config')
const MongoStore = require('connect-mongo')(session)
const mongoDbConnection = require('./utils/db.config')
const passport = require('passport')
require('./utils/authStrategies/localStrategie')
const authMiddleware = require('./middlewares/authMiddleware')
const flasherMiddleware = require('./middlewares/flasherMiddleware')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const app = express()
const config = require('./utils/config')

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug')

// app.set('trust proxy' ,1)

app.use(session({
  secret: 'db74f661bc4e3fbc683b5e28c32f2185f39934a4d2f9283559',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoDbConnection })
}))
app.use(express.static('public'))
app.use(logger('dev'))
app.use(passport.initialize())
app.use(passport.session())


/**
 * Global middleware to make logged in user available to the views
 */
app.use((req, res, next) => {
  res.locals.user = req.isAuthenticated() ? req.user : null
  return next()
})

/*
 *  App level locals
 */

app.locals.title= 'Ubiz.fr'
app.locals.message = {}
app.locals.formData = {}
app.locals.errors = {}

app.use('/', authRoutes)
app.use('/', categoryRoutes)

app.get('/', flasherMiddleware,(req, res) => {
  return res.render('index')
})

app.get('/homepage', authMiddleware, (req, res) => {
  res.render('dashboard/dashboard')
})

app.use( (req, res, next) => {
  res.status(404).render("pages/404")
})


app.listen(config.port, () => {
  console.log(`Server running at port ${config.port}`)
})

module.exports = app
