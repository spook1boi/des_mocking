import UsersMongoDAO from '../dao/mongo/users.mongo.js';
import UserDTO from '../dao/DTOs/user.dto.js';

class UsersRepository {
  constructor() {
    this.usersDAO = new UsersMongoDAO();
  }

  async getUsers() {
    return await this.usersDAO.getUsers();
  }

  async getUserById(id) {
    return await this.usersDAO.getUserById(id);
  }

  async addUser(userDTO) {
    return await this.usersDAO.addUser(userDTO);
  }

  async findUser(email) {
    return await this.usersDAO.findUser(email);
  }

  async findEmail(email) {
    return await this.usersDAO.findEmail(email);
  }
}

export default UsersRepository;