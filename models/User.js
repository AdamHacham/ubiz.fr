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
    required: [true, 'Adresse e-mail requise'],
    maxlength: [128, 'L\'adresse mail ne peut pas dépasser 64 lettres'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
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

userSchema.pre('save', async function(next) {
  if(! this.isModified('password')) next()

  this.password = bcrypt.hash(this.password, 10)
  next()
})

const User = mongoose.model('users', userSchema)

module.exports = User
