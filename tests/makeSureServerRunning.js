const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../index')

//configure chai
chai.use(chaihttp)
chai.should()

describe('Make sure that status is 200', () => {
   it('should return 200', (done) => {
     chai.request(app)
	.get('/')
	.end((err, res) => {
	    res.should.have.status(200)
	    res.body.should.be.a('object')
	    done()
	})

    })
})
