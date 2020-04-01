import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

interface ProductInterface extends Document {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
}

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  categories: {
    type: [String],
    validate: {
      message: 'Path `categories` is wrong',
      validator: (categories: Array<string>): boolean => {
        if (categories.length !== 0) {
          return categories.every(category => category.length !== 0)
        }

        return false
      }
    }
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: [0.01, 'null or negative prices are not allowed'],
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

productSchema.plugin(mongoosePaginate)

export default (model<ProductInterface>('Product', productSchema) as PaginateModel<ProductInterface>)
