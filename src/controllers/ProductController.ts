import { Request, Response } from 'express'
import { Error, PaginateResult } from 'mongoose'

import Product, { ProductInterface } from '../models/Product'

class ProductController {
  public async create (req: Request, res: Response): Promise<Response> {
    const { userId, ...rest } = req.body

    return Product.create({
      ...rest,
      owner: userId
    })
      .then(({ _id }) => res.status(201).json(_id))
      .catch(({ message }: Error) => res.status(400).json(message))
  }

  private async paginateAbstraction (page = 1, limit = 10, searchParams: object = {}): Promise<PaginateResult<ProductInterface>> {
    return Product.paginate(searchParams, { page, limit, populate: 'owner' })
  }

  private validateSearchParams (searchParams: object): boolean {
    const searchableParameters = ['_id', 'owner', 'name', 'categories', 'maxPrice']

    const searchParamsKeys = Object.keys(searchParams)

    const correctStructure = searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey))

    return correctStructure
  }

  private treatmentOfSearchParams (searchParams: { name?: string; maxPrice?: string}): object {
    const newProperties: {
      [property: string]: object;
    } = {}

    if (searchParams.name) {
      newProperties.name = { $regex: new RegExp(searchParams.name, 'i') }
    }

    if (searchParams.maxPrice) {
      newProperties.price = { $lt: parseFloat(searchParams.maxPrice) }

      delete searchParams.maxPrice
    }

    Object.assign(searchParams, newProperties)

    return searchParams
  }

  public find = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit, ...searchParams } = req.query

    if (Object.keys(searchParams).length === 0) {
      return res.json(await this.paginateAbstraction(page, limit))
    }

    if (searchParams._id) {
      return Product.findById(searchParams._id).populate('owner')
        .then((product) => res.json(product))
        .catch((err: Error) => res.status(400).json(err.message))
    }

    if (!this.validateSearchParams(searchParams)) {
      return res.status(400).json('there is a problem with the search parameters')
    }

    const treatedParams = this.treatmentOfSearchParams(searchParams)

    try {
      return res.json(await this.paginateAbstraction(page, limit, treatedParams))
    } catch (e) {
      return res.status(400).json(e.message)
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { userId, productId } = req.body

    return Product.deleteOne({ owner: userId, _id: productId })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return res.send()
        }

        return res.status(400).json('No product with this identifier is associated with this user')
      })
      .catch(({ message }: Error) => res.status(400).json(message))
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { userId, productId, ...information } = req.body

    const providedProps = Object.keys(information)

    const upgradeableProps = ['categories', 'description', 'image', 'price']

    if (productId && providedProps.length !== 0 && providedProps.every((providedProp) => upgradeableProps.includes(providedProp))) {
      return Product.updateOne({ _id: productId, owner: userId }, information, { runValidators: true })
        .then((updated) => {
          if (updated.n !== 0) {
            return res.send()
          }

          return res.status(400).json('this product does not exist')
        })
        .catch(({ message }: Error) => res.status(400).json(message))
    }

    return res.status(400).json('the set of properties provided is not acceptable')
  }
}

export default new ProductController()
