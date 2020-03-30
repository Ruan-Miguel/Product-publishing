import chai from 'chai'
import { describe, it, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'
import faker from 'faker'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('User creation routes tests', () => {
  beforeEach(async () => {
    return ClearDatabase.clearUsers()
  })

  it('should create an user', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    chai.expect(res.status).to.be.equal(201)
  })

  it('should fail because provides a date from the future', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation({ dateOfBirth: faker.date.future().toISOString().slice(0, 10) }))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because provides a password with less than 5 characters', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation({ password: faker.internet.password().slice(0, 4) }))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the name', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation(null, 'name'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the email', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation(null, 'email'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the password', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation(null, 'password'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because do not provide the date of birth', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation(null, 'dateOfBirth'))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because tries to define _id itself', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send(Object.assign({ _id: '13434213434234' }, ObjectGenerator.userCreation()))

    chai.expect(res.status).to.be.equal(400)
  })

  it('should fail because tries to create two users with the same email', async () => {
    const user = ObjectGenerator.userCreation()

    await chai.request(app)
      .post('/users')
      .send(user)

    const res = await chai.request(app)
      .post('/users')
      .send(user)

    chai.expect(res.status).to.be.equal(400)
  })
})
