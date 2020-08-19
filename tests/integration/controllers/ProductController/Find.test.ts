import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../src/app'
import ClearDatabase from '../../../utils/ClearDatabase'
import factory, { UserInterface, ProductInterface } from '../../../utils/factories'
import { json } from 'express'

chai.use(chaiHttp)

describe('Testing product research routes', () => {
  let product1: ProductInterface
  let product2: ProductInterface

  before(async () => {
    await ClearDatabase.clearAll()

    const products = [
      {
        name: 'boneca',
        categories: ['brinquedo', 'embalado'],
        price: 49.99
      },
      {
        name: 'boneco',
        categories: ['brinquedo', 'não embalado'],
        price: 39.99
      }]

    const users = await factory.createMany<UserInterface>('User', products.length);

    [product1, product2] = await Promise.all(users.map(({ _id }, index) => {
      return factory.create<ProductInterface>('Product', {
        owner: _id,
        name: products[index].name,
        categories: products[index].categories,
        price: products[index].price
      })
    }))
  })

  it('Should return all products', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(2)
  })

  it('Should return the first page with 1 product', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the second page with 1 product', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 2,
        limit: 1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with an searchParam unacceptable', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        image: faker.image.imageUrl()
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should return the product1 because of its name', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the product1 because of its name in capital letters', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name.toUpperCase()
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the product2 because its price is lower', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        maxPrice: product2.price + 0.01
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the product1 because of its _id', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        _id: product1.id
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text)._id).to.be.equal(product1.id)
  })

  it('Should fail because provides a unacceptable _id', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        _id: 'pro'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should return the product1 because of its owner', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        owner: product1.owner.toString()
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should fail because provides an unacceptable owner', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        owner: 'pro'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should return the product1 because of its category', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        categories: JSON.stringify([product1.categories[1]])
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the two products because of its category', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        categories: JSON.stringify([product1.categories[0]])
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(2)
  })

  it('No product should be returned because of its category', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        categories: JSON.stringify([product1.categories[0] + 'a'])
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('Should return product1 because of your name and owner', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        owner: product1.owner.toString()
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return product1 because of your name and category', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        categories: JSON.stringify([product1.categories[1]])
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('No product should be returned because there is no product with that name and category', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        categories: JSON.stringify([product2.categories[1]])
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('No product should be returned because there is no product with that name and price', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        maxPrice: product2.price
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('No product should be returned because there is no product with that name and price', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        maxPrice: product2.price
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })
})
