import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing product research routes', () => {
  let name: string, description: string, categories: Array<string>

  before(async () => {
    await ClearDatabase.clearAll()

    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    const token = JSON.parse(text)

    const product = ObjectGenerator.productCreation()

    if (product.name && product.categories && product.description) {
      ({ name, categories, description } = product)
    }

    return chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(product)
  })

  it('Should perform a search with an searchParam unacceptable', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        description
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
