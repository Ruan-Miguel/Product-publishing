import { Request, Response } from 'express'
import { Error, PaginateResult } from 'mongoose'

import ProductService from '../services/ProductService'
import Product, { ProductInterface } from '../models/Product'

class ProductController {
  public async create (req: Request, res: Response): Promise<Response> {
    return ProductService.create(req.body)
      .then(id => res.status(201).json(id))
      .catch(err => res.status(400).json(err.message))
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
    return ProductService.delete(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }

  public async update (req: Request, res: Response): Promise<Response> {
    return ProductService.update(req.body)
      .then(() => res.status(200).send())
      .catch(err => res.status(400).json(err.message))
  }
}

export default new ProductController()
