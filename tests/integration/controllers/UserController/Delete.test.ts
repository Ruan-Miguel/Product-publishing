import chai from 'chai'
import { describe, it, beforeEach } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../../src/app/app'
import ObjectGenerator from '../../../utils/ObjectGenerator'
import ClearDatabase from '../../../utils/ClearDatabase'

chai.use(chaiHttp)

describe('User removal routes tests', () => {
  let token: string

  beforeEach(async () => {
    await ClearDatabase.clearAll()

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

  it('Should correctly remove the user and their products', async () => {
    const createProduct = async (): Promise<ChaiHttp.Response> => {
      return chai.request(app)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .send(ObjectGenerator.productCreation())
    }

    await Promise.all([createProduct(), createProduct()])

    const res1 = await chai.request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ' + token)

    const res2 = await chai.request(app)
      .get('/products')
      .query({
        page: 1,
        limit: 10
      })

    chai.expect(res1.status).to.be.equal(200)
    chai.expect(JSON.parse(res2.text).docs.length).to.be.equal(0)
  })
})
