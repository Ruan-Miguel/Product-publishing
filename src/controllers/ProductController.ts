import { Request, Response } from 'express'

import ProductService from '../services/ProductService'

class ProductController {
  public static async create (req: Request, res: Response): Promise<Response> {
    return ProductService.create(req.body)
      .then(id => res.status(201).json(id))
      .catch(err => res.status(400).json(err.message))
  }

  public static async find (req: Request, res: Response): Promise<Response> {
    return ProductService.find(req.query)
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json(err.message))
  }

  public static async delete (req: Request, res: Response): Promise<Response> {
    return ProductService.delete(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }

  public static async update (req: Request, res: Response): Promise<Response> {
    return ProductService.update(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }
}

export default ProductController
