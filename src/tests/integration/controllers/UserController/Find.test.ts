import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing user research routes', () => {
  let name: string, email: string, dateOfBirth: string

  before(async () => {
    await ClearDatabase.clearUsers()

    const user = ObjectGenerator.userCreation()

    if (user.name && user.email && user.dateOfBirth) {
      ({ name, email, dateOfBirth } = user)
    }

    console.log(name, email, dateOfBirth)

    await chai.request(app)
      .post('/users')
      .send(user)
  })

  it('Should perform a search without searchParam', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search without searchValue', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: 'name',
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should perform a search with an acceptable _id', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: '_id',
        searchValue: '5e823c7f77235912ec483f1c',
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should perform a search with an unacceptable _id', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: '_id',
        searchValue: 'person',
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should perform a search with a name belonging to a registered user', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: 'name',
        searchValue: name,
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should perform a search with an email belonging to a registered user', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: 'email',
        searchValue: email,
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should perform a search with an searchParam unacceptable', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        searchParam: 'dateOfBirth',
        searchValue: dateOfBirth,
        page: 1,
        limit: 10
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
