import { Request, Response } from 'express'

import UserService from '../services/UserService'

class UserController {
  public static async create (req: Request, res: Response): Promise<Response> {
    return UserService.create(req.body)
      .then(token => res.status(201).json(token))
      .catch(err => res.status(400).json(err.message))
  }

  public static async login (req: Request, res: Response): Promise<Response> {
    return UserService.login(req.body)
      .then(token => res.status(200).json(token))
      .catch(err => res.status(400).json(err.message))
  }

  public static async find (req: Request, res: Response): Promise<Response> {
    return UserService.find(req.query)
      .then(users => res.status(200).json(users))
      .catch(err => res.status(400).json(err.message))
  }

  public static async delete (req: Request, res: Response): Promise<Response> {
    return UserService.delete(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }
}

export default UserController
