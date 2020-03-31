import { Router } from 'express'

import UserController from '../controllers/UserController'
import ProductController from '../controllers/ProductController'
import AuthMiddleware from '../middlewares/AuthMiddleware'

const routes = Router()

routes.use(AuthMiddleware.authVerification)

routes.delete('/users', UserController.delete)
routes.post('/products', ProductController.create)
routes.delete('/products', ProductController.delete)
routes.patch('/products', ProductController.update)

export default routes
