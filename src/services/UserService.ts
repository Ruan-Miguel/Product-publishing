import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error, PaginateResult } from 'mongoose'

import { PrivateBody } from '../routes/privateRoutes'
import User, { UserInterface } from '../models/User'
import Product from '../models/Product'
import authConfig from '../config/auth.json'

class UserService {
  private static generateToken (id: string): string {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: 86400
    })
  }

  public static async create (newUser: Record<string, unknown>): Promise<string> {
    if (newUser._id) {
      throw new Error('You can not specify your Id')
    }

    return User.create(newUser)
      .then(({ _id: id }) => {
        const token = this.generateToken(id)

        return token
      })
  }

  public static async login (data: Record<string, unknown>): Promise<string> {
    const { email, password } = data

    if (typeof email !== 'string' || email.trim() === '') {
      throw new Error('no email provided')
    }

    if (typeof password !== 'string' || password.trim() === '') {
      throw new Error('no password provided')
    }

    const user = await User.findOne({ email: email }, { password: true })

    if (user && await bcrypt.compare(password, user.password)) {
      const token = this.generateToken(user._id)

      return token
    }

    throw new Error('incorrect email or password')
  }

  private static treatAccents (words: string): string {
    words = words.replace(/a|[à-å]/gi, '(?:a|[à-å])')

    words = words.replace(/e|[è-ë]/gi, '(?:e|[è-ë])')

    words = words.replace(/i|[ì-ï]/gi, '(?:i|[ì-ï])')

    words = words.replace(/o|[ò-ö]/gi, '(?:o|[ò-ö])')

    words = words.replace(/u|[ù-ü]/gi, '(?:u|[ù-ü])')

    words = words.replace(/c|ç/gi, '(?:c|ç)')

    return words
  }

  public static async find (data: Record<string, unknown>): Promise<PaginateResult<UserInterface> | UserInterface | null> {
    let { page = 1, limit = 10, ...searchParams } = data

    if (typeof page === 'string' && page.match(/^[1-9]\d*$/)) {
      page = parseInt(page)
    }

    if (typeof page !== 'number') {
      throw new Error('page must be an unsigned integer')
    }

    if (typeof limit === 'string' && limit.match(/^[1-9]\d*$/)) {
      limit = parseInt(limit)
    }

    if (typeof limit !== 'number') {
      throw new Error('limit must be an unsigned integer')
    }

    if (searchParams._id) {
      return User.findById(searchParams._id)
    }

    if (typeof searchParams.simpleSearch === 'string') {
      const teatedString = this.treatAccents(searchParams.simpleSearch)

      return User.paginate({
        $or: [
          { name: { $regex: new RegExp(teatedString, 'i') } },
          { email: { $regex: new RegExp(teatedString, 'i') } }
        ]
      }, { page, limit })
    }

    return User.paginate(undefined, { page, limit })
  }

  public static async delete (data: PrivateBody): Promise<void> {
    const id = data.userId

    await Product.deleteMany({ owner: id })
      .then(async () => {
        await User.findByIdAndDelete(id)
      })
  }
}

export default UserService
