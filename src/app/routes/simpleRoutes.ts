import { Router } from 'express'

import UserController from '../controllers/UserController'
import ProductController from '../controllers/ProductController'

const routes = Router()

routes.get('/users', UserController.find)
routes.post('/users', UserController.create)
routes.post('/users/login', UserController.login)

routes.get('/products', ProductController.findByName)

export default routes
