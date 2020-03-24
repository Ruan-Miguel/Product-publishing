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
})
