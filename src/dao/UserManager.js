import { usersModel } from "../db/models/users.model.js";

class UserManager {
  constructor() {}

  async addUser(userData) {
    try {
      const newUser = new usersModel(userData);
      await newUser.save();
      return 'User added';
    } catch (error) {
      console.error('Error adding user:', error);
      return 'Error adding user';
    }
  }

  async validateUser(email) {
    try {
      return await usersModel.findOne({ email }).lean();
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const userData = await usersModel.findOne({ email }).lean();
      if (!userData) {
        throw new Error('User not found');
      }

      if (userData.password === password) {
        return userData;
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

export default UserManager;