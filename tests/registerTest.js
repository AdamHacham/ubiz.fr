const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../index')

//configure chai
chai.use(chaihttp)
chai.should()

describe('Make sure server is returning registration page', () => {
   it('should return a page with status 200', (done) => {
     chai.request(app)
        .get('/register')
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
//            res.body.should.be.a('object')
            done()
        })

    })
})

describe('Make sure register fails on no data', () => {
   it('should return validation errors', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/register')
        .end((err, res) => {
          if (err) return done(err)
              res.text.should.contain('Validation Errors')
//            res.body.should.be.a('object')
            done()
        })

    })
})

describe('Make sure register is successfull with valid data', () => {
   const email = `loubna.${new Date().getTime()}@ubiz.fr`
   it('should return success in responses', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/register')
        .type('form')
        .send({
	    email,
            lastname: 'Hacham',
	    firstname: 'Loubna',
            password: 'adam',
            repeat_password: 'adam'
         })
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            res.text.should.not.contain('Validation Errors')
//            res.body.should.be.a('object')
            done()
        })

   })
   it('should return validation error about unique email in responses', (done) => {
       const agent = chai.request.agent(app)
        agent
        .post('/register')
        .type('form')
        .send({
	    email,
            lastname: 'Hacham',
	    firstname: 'Loubna',
            password: 'adam',
            repeat_password: 'adam'
         })
        .end((err, res) => {
          if (err) return done(err)
            res.should.have.status(200)
            res.text.should.contain('cette adresse email existe déjà')
            res.text.should.contain('Validation Errors')
//            res.body.should.be.a('object')
            done()
        })

    })
})
