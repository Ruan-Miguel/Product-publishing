import chai from 'chai'
import { describe, it, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../app/app'
import ObjectGenerator from '../../utils/ObjectGenerator'
import ClearDatabase from '../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Authentication function tests', () => {
  let token: string

  beforeEach(async () => {
    await ClearDatabase.clearUsers()

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

  it('Should fail because provides a token for a user that does not exist in the database', async () => {
    await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ' + token)

    const res = await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ' + token)

    chai.expect(res.status).to.be.equal(401)
  })
})
