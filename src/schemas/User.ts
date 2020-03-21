import { Schema, model, Document } from 'mongoose'

interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
  name: String,
  email: String,
  password: String
})

export default model<UserInterface>('User', userSchema)
