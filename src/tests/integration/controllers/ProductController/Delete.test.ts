import chai from 'chai'
import { describe, it, before, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Product removal routes tests', () => {
  let token: string
  let productId: string

  before(async () => {
    await ClearDatabase.clearAll()

    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    token = JSON.parse(text)
  })

  beforeEach(async () => {
    await ClearDatabase.clearProducts()

    await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation())

    const { body } = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 1
      })

    productId = body.docs[0]._id
  })

  it('Should delete the product', async () => {
    const res = await chai.request(app)
      .delete('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should fail because provides an invalid productId', async () => {
    const res = await chai.request(app)
      .delete('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId: faker.random.word()
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('It should fail because provides the identifier for a product belonging to another user', async () => {
    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    const token2 = JSON.parse(text)

    const res = await chai.request(app)
      .delete('/products')
      .set('Authorization', 'Bearer ' + token2)
      .send({
        productId: productId
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
