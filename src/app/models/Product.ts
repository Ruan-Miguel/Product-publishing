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
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
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
