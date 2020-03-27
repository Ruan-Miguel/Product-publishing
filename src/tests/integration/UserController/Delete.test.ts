import chai from 'chai'
import { describe, it, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../app/app'
import ObjectGenerator from '../../utils/ObjectGenerator'
import ClearDatabase from '../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Delete function tests', () => {
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
