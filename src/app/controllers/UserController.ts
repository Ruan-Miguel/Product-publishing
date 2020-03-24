import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error } from 'mongoose'

import User from '../schemas/User'
import authConfig from '../config/auth.json'

class UserController {
  private generateToken (id: string): string {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: 86400
    })
  }

  private dateFormater (date: string): string | null {
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

    if (newUser._id) {
      return res.status(400).json('You can not specify your Id')
    }

    newUser.dateOfBirth = this.dateFormater(newUser.dateOfBirth)

    if (!newUser.dateOfBirth) {
      return res.status(400).json('Invalid date')
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

  public async read (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const id = req.body.userId

    return User.findByIdAndDelete(id)
      .then((userDeleted) => {
        if (userDeleted) {
          return res.send()
        }

        return res.status(401).json('the token used does not belong to any user registered in the database')
      })
      .catch(err => res.status(500).json(err))
  }
}

export default new UserController()
