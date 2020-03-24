import { Router } from 'express'

import UserController from '../controllers/UserController'
import AuthMiddleware from '../middlewares/AuthMiddleware'

const routes = Router()

routes.use(AuthMiddleware.authVerification)

routes.delete('/users', UserController.delete)

export default routes
