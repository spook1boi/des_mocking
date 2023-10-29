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

  async register(user) {
    try {
      const newUser = new usersModel(user);
      await newUser.save();

      return newUser;
    } catch (error) {
      throw new Error("Error while registering: " + error.message);
    }
  }

  async findUser(email) {
    try {
      const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, rol: 1 });

      if (!user) {
        return "User not found";
      }

      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      return 'Error while fetching the user';
    }
  }

  async findEmail(email) {
    try {
      const user = await usersModel.findOne({ email });

      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      return 'Error while fetching the user';
    }
  }
}

export default UserManager;