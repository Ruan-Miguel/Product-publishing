import chai from 'chai'
import { describe, it, before } from 'mocha'
import chaiHttp from 'chai-http'

import app from '../../../app/app'
import ObjectGenerator from '../../utils/ObjectGenerator'
import UserModel from '../../../app/schemas/User'

chai.use(chaiHttp)

describe('Login function tests', () => {
  let userEmail: string
  let userPassword: string

  before(async () => {
    await UserModel.deleteMany({})
      .then(() => console.log('terminou'))
      .catch(() => console.log('terminou'))

    const user = ObjectGenerator.userCreation()

    userEmail = (user.email as string)
    userPassword = (user.password as string)

    return chai.request(app)
      .post('/users')
      .send(user)
  })

  it('should correctly login', async () => {
    const res = await chai.request(app)
      .post('/users/login')
      .send({
        email: userEmail,
        password: userPassword
      })

    chai.expect(res.status).to.be.equal(200)
  })
})
