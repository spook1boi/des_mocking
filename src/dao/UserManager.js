import { usersModel } from '../db/models/users.model.js';

class UserManager {
  async getUsers() {
    try {
      const users = await usersModel.find({});
      return users;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  }

  async getUserById(id) {
    try {
      const user = await usersModel.findById(id).lean();
      if (!user) {
        return 'Usuario no encontrado';
      }
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return 'Error al obtener el usuario';
    }
  }

  async addUser(userData) {
    try {
      const userCreate = await usersModel.create(userData);
      return userCreate;
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      return 'Error al agregar el usuario';
    }
  }

  async findUser(email) {
    try {
      const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, rol: 1 });

      if (!user) {
        return "Usuario no encontrado";
      }

      return user;
    } catch (error) {
      console.error('Error al validar usuario', error);
      return 'Error al obtener el usuario';
    }
  }

  async findEmail(param) {
    try {
      const user = await usersModel.findOne(param);
      return user;
    } catch (error) {
      console.error('Error al validar usuario', error);
      return 'Error al obtener el usuario';
    }
  }
}

export default UserManager;