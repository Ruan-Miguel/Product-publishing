import { Error, PaginateResult } from 'mongoose'

import Product, { ProductInterface } from '../models/Product'
import { PrivateBody } from '../routes/privateRoutes'
import treatAccents from '../utils/treatAccents'

class ProductService {
  public static async create (data: Record<string, unknown>): Promise<string> {
    const { userId, ...rest } = data

    return Product.create({
      ...rest,
      owner: userId
    })
      .then(({ _id }) => _id)
  }

  private static validateSearchParams (searchParams: object): boolean {
    const searchableParameters = ['owner', 'name', 'categories', 'maxPrice']

    const searchParamsKeys = Object.keys(searchParams)

    const correctStructure = searchParamsKeys.every((searchParamsKey) => searchableParameters.includes(searchParamsKey))

    return correctStructure
  }

  private static treatmentOfSearchParams (searchParams: { owner?: string; name?: string; categories?: string; maxPrice?: string}): { owner?: string; name?: object; categories?: object; price?: object } {
    const newProperties: {
      owner?: string;
      name?: object;
      categories?: object;
      price?: object;
    } = {}

    if (searchParams.owner) {
      newProperties.owner = searchParams.owner
    }

    if (searchParams.name) {
      const IgnoreAccent = treatAccents(searchParams.name)

      newProperties.name = { $regex: new RegExp(IgnoreAccent, 'i') }
    }

    if (searchParams.categories) {
      newProperties.categories = { $all: JSON.parse(searchParams.categories) }
    }

    if (searchParams.maxPrice) {
      newProperties.price = { $lt: parseFloat(searchParams.maxPrice) }

      delete searchParams.maxPrice
    }

    return newProperties
  }

  public static async find (data: Record<string, unknown>): Promise<PaginateResult<ProductInterface> | ProductInterface | null> {
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

    if (Object.keys(searchParams).length === 0) {
      return Product.paginate(undefined, { page, limit, populate: 'owner' })
    }

    if (searchParams._id) {
      return Product.findById(searchParams._id).populate('owner')
    }

    if (!this.validateSearchParams(searchParams)) {
      throw new Error('there is a problem with the search parameters')
    }

    const treatedParams = this.treatmentOfSearchParams(searchParams)

    return Product.paginate(treatedParams, { page, limit, populate: 'owner' })
  }

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
