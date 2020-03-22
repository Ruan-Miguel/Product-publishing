import { Request, Response } from 'express'
import { Error } from 'mongoose'

import User from '../schemas/User'

interface UserInterface {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

class UserController {
  private dateFormater (date: string): string {
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/

    if (!dateFormat.test(date)) {
      return null
    }

    const [day, month, year] = date.split('/')

    const newDate = year + '-' + month + '-' + day + 'T00:00'

    if (new Date(newDate).toString() === 'Invalid Date') {
      return null
    }

    return newDate
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const newUser = req.body

    newUser.dateOfBirth = this.dateFormater(newUser.dateOfBirth)

    if (!newUser.dateOfBirth) {
      return res.status(400).json({ error: 'Invalid date' })
    }

    return User.create(newUser)
      .then(() => res.status(201).send())
      .catch((err: Error) => res.status(400).json(err.message))
  }

  public async read (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  }
}

export default new UserController()
