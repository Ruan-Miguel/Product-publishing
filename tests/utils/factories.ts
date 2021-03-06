import factory from 'factory-girl'
import faker from 'faker'

import User from '../../src/models/User'
import Product from '../../src/models/Product'

export { UserInterface } from '../../src/models/User'
export { ProductInterface } from '../../src/models/Product'

factory.define('User', User, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  dateOfBirth: faker.date.past().toISOString().slice(0, 10)
}))

factory.define('Product', Product, () => ({
  name: faker.commerce.product(),
  description: faker.lorem.sentence(),
  categories: [faker.commerce.productAdjective()],
  price: parseFloat(faker.commerce.price()),
  image: faker.image.imageUrl()
}))

export default factory
