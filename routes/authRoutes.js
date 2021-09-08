const express = require('express')
const router =  express.Router()
const { addUser } = require('../modules/users/service/userService')
const { registerSchema } = require('../modules/users/validation/authValidation')
const { joiErrorFormatter, mongooseErrorFormatter } = require('../utils/validationFormatter')
const passport = require('passport')
const guestMiddleware = require('../middlewares/guestMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const flasherMiddleware = require('../middlewares/flasherMiddleware')

/**
 * Shows page for registration
 */
router.get('/register', guestMiddleware, flasherMiddleware, (req, res) => {
  return res.render('register')
})


/**
 * Handle user Registration
 */
router.post('/register', guestMiddleware, async (req, res) => {
  try{
    const validationResult = registerSchema.validate(req.body, {
      abortEarly: false
    })
    if(validationResult.error) {
      req.session.flashData = {
       message: {
         type: 'error',
         body: 'Validation Errors'
       },
       errors: joiErrorFormatter(validationResult.error),
       formData: req.body

      }
      return res.redirect('/register')
    }
    const user = await addUser(req.body)
    return res.render('register', {
      message: {
        type: 'success',
        body: 'Merci pour votre inscription'
      },
      formData: req.body
    })
  } catch(e) {
    console.error(e)
//    return res.send(mongooseErrorFormatter(e))
    return res.status(400).render('register', {
      message: {
        type: 'error',
        body: 'Validation Errors'
      },
      errors: mongooseErrorFormatter(e),
      formData: req.body
    })
//    return res.status(400).render('register', { message: 'Inscription échouée' })
  }
})



/**
 * Shows page for Log in
 */
router.get('/login', guestMiddleware, (req, res) => {
  return res.render('login')
})

/**
 * Logs in a user
 */

router.post('/login', guestMiddleware, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
  }), (req, res) => {
    return res.render('login', {
      message: {
        type: 'success',
        body: 'Login success'
      }
    })
})

/**
 *  Log out User
 */
router.get('/logout', authMiddleware, (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
