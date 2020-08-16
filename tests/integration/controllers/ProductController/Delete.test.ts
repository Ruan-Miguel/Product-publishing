import chai from 'chai'
import { describe, it, before, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../src/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'
import factory, { UserInterface, ProductInterface } from '../../../utils/factories'

chai.use(chaiHttp)

describe('Product removal routes tests', () => {
  let token: string
  let userId: string
  let productId: string

  before(async () => {
    await ClearDatabase.clearAll()

    const password = faker.internet.password()

    const { id, email } = await factory.create<UserInterface>('User', { password })

    const { text } = await chai.request(app)
      .post('/users/login')
      .send({
        email,
        password
      })

    userId = id
    token = JSON.parse(text)
  })

  beforeEach(async () => {
    await ClearDatabase.clearProducts()

    const { id } = await factory.create<ProductInterface>('Product', {
      owner: userId
    })

    productId = id
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
        productId: 'pro'
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
