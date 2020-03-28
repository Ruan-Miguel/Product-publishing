import chai from 'chai'
import { describe, it, before, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('Create function tests', () => {
  let token: string

  before(async () => {
    await ClearDatabase.clearAll()

    const { text } = await chai.request(app)
      .post('/users')
      .send(ObjectGenerator.userCreation())

    token = JSON.parse(text)
  })

  beforeEach(async () => {
    return ClearDatabase.clearProducts()
  })

  it('should create a product', async () => {
    const res = await chai.request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(ObjectGenerator.productCreation())

    chai.expect(res.status).to.be.equal(201)
  })
})
