import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error, PaginateResult } from 'mongoose'

import User, { UserInterface } from '../models/User'
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

  private async paginateAbstraction (page = 1, limit = 10, searchParams: object = {}): Promise<PaginateResult<UserInterface>> {
    return User.paginate(searchParams, { page, limit })
  }

  private validateSearchParams (searchParams: object): boolean {
    const searchableParameters = ['_id', 'name', 'email']

    const searchParamsKeys = Object.keys(searchParams)

    const correctStructure = searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey))

    return correctStructure
  }

  private treatmentOfSearchParams (searchParams: { _id: string; name: string; email: string}): { [param: string]: object } {
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
  }

  public find = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit, ...searchParams } = req.query

    if (Object.keys(searchParams).length === 0) {
      return res.json(await this.paginateAbstraction(page, limit))
    }

    if (searchParams._id) {
      return User.findById(searchParams._id)
        .then((user) => res.json(user))
        .catch((err: Error) => res.status(400).json(err.message))
    }

    if (!this.validateSearchParams(searchParams)) {
      return res.status(400).json('there is a problem with the search parameters')
    }

    const treatedParams = this.treatmentOfSearchParams(searchParams)

    return res.json(await this.paginateAbstraction(page, limit, treatedParams))
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const id = req.body.userId

    return Product.deleteMany({ owner: id })
      .then(() => {
        return User.findByIdAndDelete(id)
          .then(() => {
            return res.send()
          })
      })
  }
}

export default new UserController()
