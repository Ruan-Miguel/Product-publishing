import UserModel from '../../app/models/User'

class ClearDatabase {
  public static async clearUsers (): Promise<void> {
    await UserModel.deleteMany({})
  }
}

export default ClearDatabase
