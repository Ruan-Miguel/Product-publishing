import { Schema, model, Document } from 'mongoose'

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

export default model<UserInterface>('User', userSchema)
