import UserModel from '../../src/app/models/User'
import ProductModel from '../../src/app/models/Product'

class ClearDatabase {
  public static async clearUsers (): Promise<void> {
    await UserModel.deleteMany({})
  }

  public static async clearProducts (): Promise<void> {
    await ProductModel.deleteMany({})
  }

  public static async clearAll (): Promise<void> {
    await Promise.all([ProductModel.deleteMany({}), UserModel.deleteMany({})])
  }
}

export default ClearDatabase
