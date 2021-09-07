const express = require('express')
const router =  express.Router()
const { addUser } = require('../modules/users/service/userService')
const { registerSchema } = require('../modules/users/validation/authValidation')
const { joiErrorFormatter, mongooseErrorFormatter } = require('../utils/validationFormatter')
const passport = require('passport')
const guestMiddleware = require('../middlewares/guestMiddleware')

/**
 * Shows page for registration
 */
router.get('/register', guestMiddleware, (req, res) => {
  return res.render('register', { message: {}, formData: {}, errors: {} })
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
      return res.render('register', {
       message: {
         type: 'error',
         body: 'Validation Errors'
       },
       errors: joiErrorFormatter(validationResult.error),
       formData: req.body
     })
    }
    const user = await addUser(req.body)
    return res.render('register', { 
      message: {
        type: 'success',
        body: 'Merci pour votre inscription'
      },
      errors: {},
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
  return res.render('login', { message: {}, formData: {}, errors: {} })
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
      },
      formData: {},
      errors: {}
    })
})

module.exports = router
