import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Testing user login routes', () => {
  let userEmail: string
  let userPassword: string

  before(async () => {
    await ClearDatabase.clearUsers()

    const user = ObjectGenerator.userCreation()

    userEmail = (user.email as string)
    userPassword = (user.password as string)

    return chai.request(app)
      .post('/users')
      .send(user)
  })

  it('Should correctly login', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        email: userEmail,
        password: userPassword
      })

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should fail because do not provides email', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        password: userPassword
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because do not provides password', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        email: userEmail
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because do not provides email or password', async () => {
    const res = await chai.request(app)
      .post('/users/login')

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because provides the wrong email', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        email: userEmail.slice(0, userEmail.length - 1),
        password: userPassword
      })

    chai.expect(res.status).to.be.equal(400)
  })

  it('Should fail because provides the wrong password', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        email: userEmail,
        password: userPassword.slice(0, userPassword.length - 1)
      })

    chai.expect(res.status).to.be.equal(400)
  })
})
