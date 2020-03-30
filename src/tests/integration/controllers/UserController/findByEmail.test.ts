import chai from 'chai'
import { describe, it } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'

chai.use(chaiHttp)

describe('Testing user research routes', () => {
  it('should perform a search without an email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('should perform a search with an email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        email: 'person',
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })
})
