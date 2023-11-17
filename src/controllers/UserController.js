import jwt from 'jsonwebtoken';
import UserManager from '../dao/UserManager.js';

class UserController {
  constructor() {
    this.userManager = new UserManager();
  }

  async getUsers() {
    try {
      return await this.userManager.getUsers();
    } catch (error) {
      console.error('Error while fetching users:', error);
      return [];
    }
  }

  async getUserById(id) {
    try {
      return await this.userManager.getUserById(id);
    } catch (error) {
      console.error('Error while fetching the user:', error);
      return 'Error while fetching the user';
    }
  }

  async register(user) {
    try {
      const newUser = await this.userManager.addUser(user);
      return newUser;
    } catch (error) {
      console.error('Error while registering:', error);
      throw new Error('Error while registering');
    }
  }

  async findUser(email) {
    try {
      return await this.userManager.findUser(email);
    } catch (error) {
      console.error('Error while validating the user', error);
      throw new Error('Error while validating the user');
    }
  }

  async findEmail(email) {
    try {
      return await this.userManager.findEmail(email);
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

export default UserController;