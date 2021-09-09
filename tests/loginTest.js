const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../index')
const User = require('../modules/users/models/User')


//configure chai
chai.use(chaihttp)
chai.should()

describe('Make sure server is returning login page', () => {
   it('should return a page with status 200', (done) => {
     chai.request(app)
        .get('/login')
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            done()
        })

    })
})

describe('Make sure login fails invalid data', () => {
   it('should return validation errors', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/login')
        .end((err, res) => {
          if (err) return done(err)
            res.text.should.contain('Missing credentials')
            done()
        })

    })
})

describe('Make sure login returns email not found when used invalid email', () => {
   const email = `loubna.${new Date().getTime()}@ubiz.fr`
   it('should return User not fount in responses', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/login')
        .type('form')
        .send({
	    email,
            password: 'adam'
         })
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            res.text.should.contain('Identifiant inconnu')
            done()
        })

   })
})

describe('Make sure login returns incorrect password', () => {
   it('should return Incorrect password in responses', (done) => {
     User.findOne({}, { email: 1})
      .then(user => {
       const agent = chai.request.agent(app)
        agent
        .post('/login')
        .type('form')
        .send({
	    email: user.email,
            password: new Date().getTime()
         })
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            res.text.should.contain('Mot de passe incorrect')
            done()
        })
      })
   })
})

describe('Make sure login returns success with a valid data', () => {
   it('should return login successfully  in responses', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/login')
        .type('form')
        .send({
	    email: 'szsz@szsz.com',
            password: 'szsz'
         })
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            res.text.should.contain('welcome')
            done()
        })
   })
})
