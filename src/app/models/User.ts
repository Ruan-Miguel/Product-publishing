import { Schema, model, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import bcrypt from 'bcrypt'

interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: [5, 'Too few characters'],
    select: false,
    required: true
  },
  dateOfBirth: {
    type: Date,
    max: [new Date().toISOString(), 'the date informed is from the future'],
    required: true
  }
})

userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.get('password'), 10)
  this.set('password', hash)

  next()
})

userSchema.plugin(mongoosePaginate)

export default model<UserInterface>('User', userSchema)
