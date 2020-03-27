import chai from 'chai'
import { describe, it, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../app/app'
import ObjectGenerator from '../../utils/ObjectGenerator'
import UserModel from '../../../app/models/User'

chai.use(chaiHttp)

describe('Login function tests', () => {
  let token: string

  beforeEach(async () => {
    await UserModel.deleteMany({})

    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    token = JSON.parse(text)
  })

  it('Should correctly remove the user', async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ' + token)

    chai.expect(res.status).to.be.equal(200)
  })

  it('Should fail because does not provide token', async () => {
    const res = await chai.request(app)
      .delete('/users')

    chai.expect(res.status).to.be.equal(401)
  })

  it('Should fail because does not provide the correct authentication model', async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set('Authorization', token)

    chai.expect(res.status).to.be.equal(401)
  })

  it('Should fail because does not provide the correct authentication model', async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ')

    chai.expect(res.status).to.be.equal(401)
  })

  it('Should fail because provides the wrong token', async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ' + token + 'a')

    chai.expect(res.status).to.be.equal(401)
  })
})
