import { usersModel } from '../db/models/users.model.js';
import jwt from 'jsonwebtoken';

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
      const user = new usersModel(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      console.error('Error while adding the user:', error);
      throw new Error('Error while adding the user');
    }
  }

  async register(user) {
    try {
      const newUser = new usersModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('Error while registering:', error);
      throw new Error('Error while registering');
    }
  }

  async findUser(email) {
    try {
      const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, rol: 1 });

      if (!user) {
        return null; 
      }

      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      throw new Error('Error while validating the user');
    }
  }

  async findEmail(email) {
    try {
      const user = await usersModel.findOne({ email });

      return user;
    } catch (error) {
      console.error('Error while validating the user', error);
      throw new Error('Error while validating the user');
    }
  }

  async generateToken(user) {
    try {
      const token = jwt.sign({ email: user.email, rol: user.rol }, 'secret_key', { expiresIn: '1h' });
      return token;
    } catch (error) {
      console.error('Error while generating token:', error);
      throw new Error('Error while generating token');
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, 'secret_key');
      return decoded;
    } catch (error) {
      console.error('Error while verifying token:', error);
      throw new Error('Error while verifying token');
    }
  }
}

export default UserManager;