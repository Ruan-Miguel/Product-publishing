import chai from 'chai'
import { describe, it } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'

chai.use(chaiHttp)

describe('Testing product research routes', () => {
  it('should perform a search without an email', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('should perform a search with an name', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        name: 'product',
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })
})
