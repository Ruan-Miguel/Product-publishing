import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../src/app/app'
import ClearDatabase from '../../../utils/ClearDatabase'
import factory, { UserInterface } from '../../../utils/factories'

chai.use(chaiHttp)

describe('Testing user research routes', () => {
  const user1 = {
    name: 'Person One',
    email: 'person_one@gmail.com',
    dateOfBirth: ''
  }

  const user2 = {
    name: 'Person Two',
    email: 'person_two@gmail.com'
  }

  before(async () => {
    await ClearDatabase.clearUsers()

    const { dateOfBirth } = await factory.create<UserInterface>('User', { name: user1.name, email: user1.email })

    await factory.create<UserInterface>('User', { name: user2.name, email: user2.email })

    user1.dateOfBirth = dateOfBirth.toISOString().slice(0, 10)
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

  it('Should return the user regarding name', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: user1.name
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user referring to name with capital letters', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: user1.name
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user regarding email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        email: user1.email
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user referring to email with capital letters', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        email: user1.email
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should return the user regarding name and email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: user1.name,
        email: user1.email
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(1)
  })

  it('Should not return a user because there is no user with the name and email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: user1.name,
        email: user2.email
      })

    chai.expect(res.status).to.be.equal(200)
    chai.expect(JSON.parse(res.text).docs.length).to.be.equal(0)
  })

  it('Should not return a user because there is no user with the name and email', async () => {
    const res = await chai.request(app)
      .get('/users')
      .query({
        page: 1,
        limit: 2,
        name: user2.name,
        email: user1.email
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
        name: user2.name,
        email: user1.email,
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
        name: user2.name,
        email: user1.email,
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
        dateOfBirth: user1.dateOfBirth
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
