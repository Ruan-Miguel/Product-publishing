import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing product update routes', () => {
  let token: string
  let productId: string

  before(async () => {
    await ClearDatabase.clearAll()

    const { text: text1 } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    token = JSON.parse(text1)

    await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation())

    const { text: text2 } = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10
      })

    productId = JSON.parse(text2).docs[0]._id
  })

  it('Should update the product description', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        description: faker.lorem.sentences()
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should update the product categories with a single string', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        categories: faker.random.word()
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should update the product categories with a string array', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        categories: [faker.random.word()]
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should update the product image', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        image: faker.image.imageUrl()
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should update the product price with a valid value', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: faker.commerce.price()
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should fail because tries to update the product price with a null value', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: 0
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update the product price with a negative value', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: -1 * parseFloat(faker.commerce.price())
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update the product categories with an empty array', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: []
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update the product categories with an array with an empty string', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: [faker.random.word(), '']
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update the product categories with an empty string', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        price: ''
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update a product without specifying any updatable fields', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update a product with a field not updatable', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because tries to update a product without provides the productId', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        description: faker.lorem.sentences()
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should update the product description and image', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId,
        image: faker.image.imageUrl(),
        description: faker.lorem.sentences()
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should fail because tries to update a product that is not yours', async () => {
    const res = await chai.request(app)
      .patch('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId: productId.replace(/.$/, (letter) => (letter === 'a') ? 'b' : 'a'),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentences()
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
