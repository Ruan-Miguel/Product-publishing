import faker from 'faker'

type UserCreationTypes = 'name' | 'email' | 'password' | 'dateOfBirth'

type UserCreationInterface = {
  [property in UserCreationTypes]?: string
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
      if (specifications.name) {
        user.name = specifications.name
      }

      if (specifications.email) {
        user.email = specifications.email
      }

      if (specifications.password) {
        user.password = specifications.password
      }

      if (specifications.dateOfBirth) {
        user.dateOfBirth = specifications.dateOfBirth
      }
    }

    if (exclude) {
      delete user[exclude]
    }

    return user
  }
}

export default ObjectGenerator
