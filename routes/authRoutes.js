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
    req.session.flashData = {
     message: {
       type: 'success',
       body: 'Inscription réussie'
     },
    }
    return res.redirect('/register')
  } catch(e) {
    console.error(e)
    req.session.flashData = {
      message: {
        type: 'error',
        body: 'Validation Errors'
      },
      errors: mongooseErrorFormatter(e),
      formData: req.body
    }
    return res.redirect('/register')
  }
})



/**
 * Shows page for Log in
 */
router.get('/login', guestMiddleware, flasherMiddleware, (req, res) => {
  return res.render('login')
})

/**
 * Logs in a user
 */

router.post('/login', guestMiddleware, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
   if (err) {
     console.error('Err : ', err)
     req.session.flashData = {
       message: {
         type: 'error',
         body: 'Connexion echouée'
       }
     }
     return res.redirect('/login')
   }
   if (!user) {
     req.session.flashData = {
       message: {
         type: 'error',
         body: info.error
       }
     }
     return  res.redirect('/login')
   }
   req.logIn(user, (err) => {
     if (err) {
       req.session.flashData = {
         message: {
           type: 'error',
           body: 'Connexion echouée'
         }
       }
     }
     return res.redirect('/homepage')
   })
  })(req, res, next)
})

/**
 *  Log out User
 */
router.get('/logout', authMiddleware, (req, res) => {
  req.logout()
  req.session.flashData = {
    message: {
      type: 'success',
      body: 'Logout success'
    }
  }
  return res.redirect('/')
})

module.exports = router
