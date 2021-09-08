const Joi = require('joi');

const registerSchema = Joi.object({

    lastname: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    firstname: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    password: Joi.string()
        .required(),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','fr'] } })
})
    .with('password', 'repeat_password');


module.exports = { registerSchema }
