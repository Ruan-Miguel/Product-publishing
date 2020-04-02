import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error } from 'mongoose'

import User from '../models/User'
import Product from '../models/Product'
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
    const { page, limit, ...searchParams } = req.query

    if (Object.keys(searchParams).length !== 0) {
      const searchableParameters = ['_id', 'name', 'email']

      const searchParamsKeys = Object.keys(searchParams)
      const searchParamsValues = Object.values(searchParams)

      if (searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey)) && searchParamsValues.every((searchParamsValue) => typeof searchParamsValue === 'string')) {
        if (searchParams._id) {
          return User.findById(searchParams._id)
            .then((user) => res.json(user))
            .catch((err: Error) => res.status(400).json(err.message))
        }

        let searchParamsArray = Object.entries(searchParams)

        searchParamsArray = searchParamsArray.map((pair) => [pair[0], (pair[1] as string).replace(new RegExp('[^a-zA-Z0-9]', 'g'), (character: string) => '\\' + character)])

        searchParamsArray = searchParamsArray.map((pair) => [pair[0], { $regex: new RegExp((pair[1] as string), 'i') }])

        searchParamsArray.forEach((pair) => {
          searchParams[pair[0]] = pair[1]
        })

        return User.paginate(
          searchParams,
          { page, limit }
        )
          .then((users) => res.json(users))
      }

      return res.status(400).json('there is a problem with the search parameters')
    }

    return User.paginate({}, { page, limit })
      .then((users) => res.json(users))
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const id = req.body.userId

    return Product.deleteMany({ owner: id })
      .then(() => {
        return User.findByIdAndDelete(id)
          .then(() => {
            return res.send()
          })
          .catch(({ message }: Error) => res.status(400).json(message))
      })
      .catch(({ message }: Error) => res.status(400).json(message))
  }
}

export default new UserController()
