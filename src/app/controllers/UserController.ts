import { Request, Response } from 'express'
import { Error, PaginateResult } from 'mongoose'

import User, { UserInterface } from '../models/User'
import UserService from '../services/UserService'

class UserController {
  public async create (req: Request, res: Response): Promise<Response> {
    return UserService.create(req.body)
      .then(token => res.status(201).json(token))
      .catch(err => res.status(400).json(err.message))
  }

  public login = async (req: Request, res: Response): Promise<Response> => {
    return UserService.login(req.body)
      .then(token => res.status(200).json(token))
      .catch(err => res.status(400).json(err.message))
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
    return UserService.delete(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }
}

export default new UserController()
