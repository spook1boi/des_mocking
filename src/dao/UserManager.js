import { usersModel } from '../db/models/users.model.js';

class UserManager {
  async getUsers() {
    try {
      const users = await usersModel.find({});
      return users;
    } catch (error) {
      console.error('Error while fetching users:', error);
      return [];
    }
  }

  async getUserById(id) {
    try {
      const user = await usersModel.findById(id).lean();
      if (!user) {
        return 'User not found';
      }
      return user;
    } catch (error) {
      console.error('Error while fetching the user:', error);
      return 'Error while fetching the user';
    }
  }

  async addUser(userData) {
    try {
      const userCreate = await usersModel.create(userData);
      return userCreate;
    } catch (error) {
      console.error('Error while adding the user:', error);
      return 'Error while adding the user';
    }
  }

  async findUser(email) {
    try {
      const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, role: 1 });

      if (!user) {
        return "User not found";
      }

      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      return 'Error while fetching the user';
    }
  }

  async findEmail(param) {
    try {
      const user = await usersModel.findOne(param);
      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      return 'Error while fetching the user';
    }
  }
}

export default UserManager;