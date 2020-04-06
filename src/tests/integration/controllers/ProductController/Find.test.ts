import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing product research routes', () => {
  type ProductInterface = {
    _id: string;
    owner: string;
    name: string;
    categories: string[];
    price: number;
}

  const product1: ProductInterface = {
    _id: '',
    owner: '',
    name: 'boneca',
    categories: ['brinquedo', 'embalado'],
    price: 49.99
  }

  const product2: ProductInterface = {
    _id: '',
    owner: '',
    name: 'boneco',
    categories: ['brinquedo', 'não embalado'],
    price: 39.99
  }

  before(async () => {
    await ClearDatabase.clearAll()

    const createProducts = async (product: ProductInterface): Promise<void> => {
      const { text: token } = await chai.request(app)
        .post('/users')
        .send(ObjectGenerator.userCreation())

      await chai.request(app)
        .post('/products')
        .set('Authorization', 'Bearer ' + JSON.parse(token))
        .send(ObjectGenerator.productCreation({
          name: product.name,
          categories: product.categories,
          price: product.price
        }))
    }

    const getProducts = async (product: ProductInterface): Promise<void> => {
      const { text } = await chai.request(app)
        .get('/products')
        .query({
          page: 1,
          limit: 1,
          name: product.name
        })

      const dbProduct = JSON.parse(text).docs[0]

      product._id = dbProduct._id
      product.owner = dbProduct.owner._id
    }

    await Promise.all([
      createProducts(product1),
      createProducts(product2)
    ])

    await Promise.all([
      getProducts(product1),
      getProducts(product2)
    ])
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
        _id: product1._id
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text)._id).to.be.equal(product1._id)
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
        owner: product1.owner
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
        categories: product1.categories[1]
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
        categories: product1.categories[0]
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
        categories: product1.categories[0] + 'a'
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
        owner: product1.owner
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return product1 because of your name and owner', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        name: product1.name,
        owner: product1.owner
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
        categories: product1.categories[1]
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
        categories: product2.categories[1]
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
