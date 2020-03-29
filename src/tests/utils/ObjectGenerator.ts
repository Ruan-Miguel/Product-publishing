import faker from 'faker'

type UserCreationTypes = 'name' | 'email' | 'password' | 'dateOfBirth'

type UserCreationInterface = {
  [property in UserCreationTypes]?: string
}

type ProductCreationInterface = {
  name?: string;
  description?: string;
  categories?: Array<string>;
  image?: string;
  price?: number;
}

class ObjectGenerator {
  public static userCreation (specifications?: UserCreationInterface | null, exclude?: UserCreationTypes): UserCreationInterface {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      dateOfBirth: faker.date.past().toISOString().slice(0, 10)
    }

    if (specifications) {
      Object.assign(user, specifications)
    }

    if (exclude) {
      delete user[exclude]
    }

    return user
  }

  public static productCreation (specifications?: ProductCreationInterface | null, exclude?: keyof ProductCreationInterface): ProductCreationInterface {
    const product: ProductCreationInterface = {
      name: faker.commerce.product(),
      description: faker.lorem.sentence(),
      categories: [faker.commerce.productAdjective()],
      price: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    }

    if (specifications) {
      Object.assign(product, specifications)
    }

    if (exclude) {
      delete product[exclude]
    }

    return product
  }
}

export default ObjectGenerator
