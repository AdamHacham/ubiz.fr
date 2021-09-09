const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  lastname: {
    type: String,
    required: [true, 'Nom requis'],
    minlength: [2, 'Le Nom ne peut pas être inférieur à 2 lettres'],
    maxlength: [64, 'Le Nom ne peut pas dépasser 64 lettres']
  },
  firstname: {
    type: String,
    required: [true, 'Nom requis'],
    minlength: [2, 'Le Nom ne peut pas être inférieur à 2 lettres'],
    maxlength: [64, 'Le Nom ne peut pas dépasser 64 lettres']
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Adresse e-mail requise'],
    maxlength: [128, 'L\'adresse mail ne peut pas dépasser 64 lettres'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
 //   bcrypt: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})


/**
 *  Validation unique E-mail
 */
userSchema.path('email').validate(async (email) => {
    const emailCount = await mongoose.models.users.countDocuments({ email })
    return !emailCount
}, 'cette adresse email existe déjà')



/**
 *  Encrypt password if value is changed
 */
userSchema.pre('save', function (next) {

  const user = this;

  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) return next(hashErr)
      user.password = hash
      next()
    })
  })

})

userSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

const User = mongoose.model('users', userSchema)

module.exports = User
