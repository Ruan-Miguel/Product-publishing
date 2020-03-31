import { Request, Response } from 'express'
import { Error } from 'mongoose'

import Product from '../models/Product'

class ProductController {
  public async create (req: Request, res: Response): Promise<Response> {
    const { userId, ...rest } = req.body

    return Product.create({
      ...rest,
      owner: userId
    })
      .then(() => res.status(201).send())
      .catch(({ message }: Error) => res.status(400).json(message))
  }

  public async findByName (req: Request, res: Response): Promise<Response> {
    const { searchParam, page, limit } = req.query

    let { searchValue } = req.query

    if (searchParam && searchValue) {
      const searchableParameters = ['_id', 'name', 'categories', 'owner']

      if (searchableParameters.some((parameter) => parameter === searchParam)) {
        if (searchParam === '_id') {
          return Product.findById(searchValue)
            .then((product) => res.json(product))
            .catch((err: Error) => res.status(400).json(err.message))
        } else if (searchParam === 'owner') {
          return Product.paginate(
            { owner: searchValue },
            { page, limit, populate: 'owner' }
          )
            .then((products) => res.json(products))
            .catch((err: Error) => res.status(400).json(err.message))
        } else {
          searchValue = searchValue.replace(new RegExp('[^a-zA-Z0-9]', 'g'), (character: string) => '\\' + character)

          return Product.paginate(
            { [searchParam]: { $regex: new RegExp(searchValue, 'i') } },
            { page, limit, populate: 'owner' }
          )
            .then((products) => res.json(products))
        }
      }

      return res.status(400).json('an unrecognized searchParam was provided')
    } else {
      return Product.paginate({}, { page, limit, populate: 'owner' })
        .then((users) => res.json(users))
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
}

export default new ProductController()
