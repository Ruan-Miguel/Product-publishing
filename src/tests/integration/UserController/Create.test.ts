import chai from 'chai'
import { describe, it, after, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'
import chaiThings from 'chai-things'
import mongoose from 'mongoose'

import app from '../../../app/app'
import UserModel from '../../../app/schemas/User'

chai.use(chaiHttp)
chai.use(chaiThings)

describe('Create function tests', () => {
  beforeEach(async () => {
    return UserModel.deleteMany({})
  })

  after(async () => {
    return mongoose.disconnect()
  })

  it('should create an user', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        password: '12345',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(201)
  })

  it('should fail because provides a date from the future', async () => {
    const completeDateOfToday = new Date()
    const tomorrow = (completeDateOfToday.getDate() + 1).toString().padStart(2, '0')

    const completeDate = tomorrow + '/' + (completeDateOfToday.getMonth() + 1).toString().padStart(2, '0') + '/' + completeDateOfToday.getFullYear()

    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        password: '12345',
        dateOfBirth: completeDate
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because provides a password with less than 5 characters', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        password: '1234',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the name', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        email: 'person@gmail.com',
        password: '12345',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the email', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        password: '12345',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the password', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the date of birth', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        password: '12345'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because tries to define _id itself', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        _id: '13434213434234',
        name: 'Person',
        email: 'person@gmail.com',
        password: '12345',
        dateOfBirth: '01/01/2001'
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because tries to create two users with the same email', async () => {
    await chai.request(app)
      .post('/users')
      .send({
        name: 'Person',
        email: 'person@gmail.com',
        password: '12345',
        dateOfBirth: '01/01/2001'
      })

    const res = await chai.request(app)
      .post('/users')
      .send({
        name: 'Person2',
        email: 'person@gmail.com',
        password: '54321',
        dateOfBirth: '02/02/2002'
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
