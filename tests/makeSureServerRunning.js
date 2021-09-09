const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../index')

//configure chai
chai.use(chaihttp)
chai.should()

describe('Make sure server is running', () => {
   it('should return page with status 200', (done) => {
     chai.request(app)
	.get('/')
	.end((err, res) => {
	    res.should.have.status(200)
	    done()
	})

    })
})
