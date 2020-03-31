import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

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

  it('Should perform a search without searchParam or searchValue', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search without searchParam', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchValue: faker.random.word()
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search without searchValue', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: faker.random.word()
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with an acceptable _id', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: '_id',
        searchValue: '5e823c7f77235912ec483f1c'
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should perform a search with an unacceptable _id', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: '_id',
        searchValue: 'pro'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should perform a search with a name belonging to a registered product', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: 'name',
        searchValue: name
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with a category belonging to a registered product', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: 'categories',
        searchValue: categories[0]
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with a owner belonging to a registered product', async () => {
    const { text } = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 1
      })

    const userId = JSON.parse(text).docs[0]._id

    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: 'owner',
        searchValue: userId
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with an unacceptable owner', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: 'owner',
        searchValue: faker.random.word()
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should perform a search with an searchParam unacceptable', async () => {
    const res = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10,
        searchParam: 'description',
        searchValue: description
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
