import chai from 'chai'
import { describe, it, before, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Create function tests', () => {
  let token: string

  before(async () => {
    await ClearDatabase.clearAll()

    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    token = JSON.parse(text)
  })

  beforeEach(async () => {
    return ClearDatabase.clearProducts()
  })

  it('Should create a product', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation())

    chai.expect(res.status).to.be.equal(201)
  })

  it('Should create a product without description', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation(null, 'description'))

    chai.expect(res.status).to.be.equal(201)
  })

  it('Should fail because do not provides the name', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation(null, 'name'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because do not provides the categories', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation(null, 'categories'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because do not provides the image', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation(null, 'image'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because do not provides the price', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation(null, 'price'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because provides a zero price', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation({ price: 0 }))

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because provides a negative price', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation({ price: -1 * parseFloat(faker.commerce.price()) }))

    chai.expect(res.status).to.be.equal(400)
  })
})
