import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing user research routes', () => {
  const name1 = 'Person One'
  const email1 = 'person_one@gmail.com'
  let dateOfBirth1: string

  const name2 = 'Person Two'
  const email2 = 'person_two@gmail.com'

  before(async () => {
    await ClearDatabase.clearUsers()

    const user1 = ObjectGenerator.userCreation({ name: name1, email: email1 })

    const user2 = ObjectGenerator.userCreation({ name: name2, email: email2 })

    if (user1.dateOfBirth) {
      ({ dateOfBirth: dateOfBirth1 } = user1)
    }

    return Promise.all([
      chai.request(app)
        .post('/users')
        .send(user1),
      chai.request(app)
        .post('/users')
        .send(user2)
    ])
  })

  it('Should return the first page', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the second page', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 2,
        limit: 1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return all the users', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(2)
  })

  it('Should return the user regarding name1', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: name1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user referring to name1 with capital letters', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: name1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user regarding email1', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        email: email1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user referring to email1 with capital letters', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        email: email1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user regarding name1 and email1', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: name1,
        email: email1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should not return a user because there is no user with the name1 and email2', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: name1,
        email: email2
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('Should not return a user because there is no user with the name2 and email1', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: name2,
        email: email1
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('Should return the user corresponding to the given _id', async () => {
    const { text } = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 1
      })

    const id = JSON.parse(text).docs[0]._id

    const res = await chai.request(app)
      .get('/users')
      .query({
        _id: id
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text)._id).to.be.equal(id)
  })

  it('Should return the user corresponding to the given _id independent of the other parameters', async () => {
    const { text } = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 1
      })

    const id = JSON.parse(text).docs[0]._id

    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 36,
        limit: 50,
        name: name2,
        email: email1,
        _id: id
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text)._id).to.be.equal(id)
  })

  it('Should fail because provides an unacceptable _id', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 36,
        limit: 50,
        name: name2,
        email: email1,
        _id: 'pro'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because provides an invalid property', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 10,
        dateOfBirth: dateOfBirth1
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
