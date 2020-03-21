import { Request, Response } from 'express'

import User from '../schemas/User'

class UserController {
  public async HelloWorld (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  }
}

export default new UserController()
