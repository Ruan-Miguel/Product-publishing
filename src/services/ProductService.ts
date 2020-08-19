import { Error/* , PaginateResult */ } from 'mongoose'

import Product/* , { ProductInterface } */ from '../models/Product'
import { PrivateBody } from '../routes/privateRoutes'

class ProductService {
  public static async create (data: Record<string, unknown>): Promise<string> {
    const { userId, ...rest } = data

    return Product.create({
      ...rest,
      owner: userId
    })
      .then(({ _id }) => _id)
  }

  /* private static async paginateAbstraction (page = 1, limit = 10, searchParams: object = {}): Promise<PaginateResult<ProductInterface>> {
    return Product.paginate(searchParams, { page, limit, populate: 'owner' })
  }

  private static validateSearchParams (searchParams: object): boolean {
    const searchableParameters = ['_id', 'owner', 'name', 'categories', 'maxPrice']

    const searchParamsKeys = Object.keys(searchParams)

    const correctStructure = searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey))

    return correctStructure
  }

  private static treatmentOfSearchParams (searchParams: { name?: string; maxPrice?: string}): object {
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

  public static async find (req: Request, res: Response): Promise<Response> {
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
  } */

  public static async delete (data: PrivateBody): Promise<void> {
    const { userId, productId } = data

    if (typeof productId !== 'string') {
      throw new Error('incorrect product id')
    }

    return Product.deleteOne({ owner: userId, _id: productId })
      .then(({ deletedCount }) => {
        if (deletedCount !== 1) {
          throw new Error('No product is associated with this user')
        }
      })
  }

  public static async update (data: PrivateBody): Promise<void> {
    const { userId, productId, ...information } = data

    if (typeof productId !== 'string') {
      throw new Error('incorrect product id')
    }

    const providedProps = Object.keys(information)

    if (providedProps.length === 0) {
      throw new Error('no properties to update')
    }

    const immutableProps = ['_id', 'owner']

    const isValid = immutableProps.every(prop => !information[prop])

    if (!isValid) {
      throw new Error('invalid set of properties')
    }

    return Product.updateOne({ _id: productId, owner: userId }, information, { runValidators: true })
      .then((updated) => {
        if (updated.n === 0) {
          throw new Error('the set of properties provided is not acceptable')
        }
      })
  }
}

export default ProductService
