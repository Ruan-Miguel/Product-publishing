import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error } from 'mongoose'

import User from '../models/User'
import authConfig from '../config/auth.json'

class UserController {
  private generateToken (id: string): string {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: 86400
    })
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const newUser = req.body

    if (newUser._id) {
      return res.status(400).json('You can not specify your Id')
    }

    return User.create(newUser)
      .then(({ _id: id }: { _id: string }) => {
        const token = this.generateToken(id)
        return res.status(201).json(token)
      })
      .catch((err: Error) => res.status(400).json(err.message))
  }

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: { email: string; password: string } = req.body

    if (!email || !password) {
      return res.status(400).json('no email or password provided')
    }

    const user = await User.findOne({ email: email }, { password: true })

    if (user && await bcrypt.compare(password, user.password)) {
      const token = this.generateToken(user._id)

      return res.json(token)
    }

    return res.status(400).json('incorrect email or password')
  }

  public async find (req: Request, res: Response): Promise<Response> {
    const { searchParam, page, limit } = req.query

    let { searchValue } = req.query

    if (searchParam && searchValue) {
      const searchableParameters = ['_id', 'name', 'email']

      if (searchableParameters.some((parameter) => parameter === searchParam)) {
        if (searchParam === '_id') {
          return User.findById(searchValue)
            .then((users) => res.json(users))
            .catch((err: Error) => res.status(400).json(err.message))
        } else {
          searchValue = searchValue.replace(new RegExp('[^a-zA-Z0-9]', 'g'), (character: string) => '\\' + character)

          return User.paginate(
            { [searchParam]: { $regex: new RegExp(searchValue, 'i') } },
            { page: parseInt(page), limit: parseInt(limit) }
          )
            .then((users) => res.json(users))
        }
      }

      return res.status(400).json('an unrecognized searchParam was provided')
    } else {
      return User.paginate({}, { page: parseInt(page), limit: parseInt(limit) })
        .then((users) => res.json(users))
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const id = req.body.userId

    return User.findByIdAndDelete(id)
      .then(() => {
        return res.send()
      })
  }
}

export default new UserController()
