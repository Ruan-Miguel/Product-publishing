import { Router } from 'express'

import UserController from '../controllers/UserController'

const routes = Router()

routes.get('/users', UserController.read)
routes.post('/users', UserController.create)
routes.post('/users/login', UserController.login)

export default routes