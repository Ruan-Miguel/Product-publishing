import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error } from 'mongoose'

import User from '../models/User'
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
        const token = UserService.generateToken(id)

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
      const token = UserService.generateToken(user._id)

      return token
    }

    throw new Error('incorrect email or password')
  }

  /* private async paginateAbstraction (page = 1, limit = 10, searchParams: object = {}): Promise<PaginateResult<UserInterface>> {
    return User.paginate(searchParams, { page, limit })
  } */

  /* private validateSearchParams (searchParams: object): boolean {
    const searchableParameters = ['name', 'email']

    const searchParamsKeys = Object.keys(searchParams)

    const correctStructure = searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey))

    return correctStructure
  } */

  /* private treatmentOfSearchParams (searchParams: { name: string; email: string}): { [param: string]: object } {
    let searchParamsArray = Object.entries(searchParams)

    searchParamsArray = searchParamsArray.map((pair) => [pair[0], (pair[1] as string).replace(new RegExp('[^a-zA-Z0-9]', 'g'), (character: string) => '\\' + character)])

    const treatedParamsArray: [string, object][] = []

    searchParamsArray.forEach((pair) => {
      treatedParamsArray.push([pair[0], { $regex: new RegExp((pair[1] as string), 'i') }])
    })

    const treatedParams: {
      [param: string]: object;
    } = {}

    treatedParamsArray.forEach((pair) => {
      treatedParams[pair[0]] = pair[1]
    })

    return treatedParams
  } */

  /* public find = async (data: Record<string, unknown>): Promise<PaginateResult<UserInterface> | UserInterface | null> => {
    const { page, limit, ...searchParams } = data

    if (Object.keys(searchParams).length === 0) {
      return this.paginateAbstraction(page, limit)
    }

    if (searchParams._id) {
      return User.findById(searchParams._id)
    }

    if (!this.validateSearchParams(searchParams)) {
      throw new Error('there is a problem with the search parameters')
    }

    const treatedParams = this.treatmentOfSearchParams(searchParams)

    return this.paginateAbstraction(page, limit, treatedParams)
  } */

  public static async delete (data: Record<string, unknown>): Promise<void> {
    const id = data.userId

    if (typeof id === 'string') {
      await Product.deleteMany({ owner: id })
        .then(async () => {
          await User.findByIdAndDelete(id)
        })
    }
  }
}

export default UserService
