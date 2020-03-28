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
      .catch((err: Error) => res.status(400).json(err))
  }

  public async findByName (req: Request, res: Response): Promise<Response> {
    const { name, page, limit } = req.query

    let products

    if (name) {
      products = await Product.paginate({ name: { $regex: new RegExp(name, 'i') } }, { page, limit, populate: 'owner' })
    } else {
      products = await Product.paginate({}, { page, limit, populate: 'owner' })
    }

    return res.json(products)
  }
}

export default new ProductController()
