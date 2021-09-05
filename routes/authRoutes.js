const express = require('express')
const router =  express.Router()
const { addUser } = require('../modules/users/service/userService')
const { registerSchema } = require('../modules/users/validation/authValidation')
const { joiErrorFormatter, mongooseErrorFormatter } = require('../utils/validationFormatter')


/**
 * Shows page for registration
 */
router.get('/register', (req, res) => {
  return res.render('register', { message: null })
})


/**
 * Handle user Registration
 */
router.post('/register', async (req, res) => {
  try{
    const validationResult = registerSchema.validate(req.body, {
      abortEarly: false
    })
    if(validationResult.error) {
//      return res.send(joiErrorFormatter(validationResult.error))
     return res.render('register', { message: 'Validation Errors' })
    }
    const user = await addUser(req.body)
    return res.render('register', { message: 'Merci pour votre inscription' })
  } catch(e) {
    console.error(e)
    return res.send(mongooseErrorFormatter(e))
    return res.status(400).render('register', { message: 'Inscription échouée' })
  }
})


module.exports = router
