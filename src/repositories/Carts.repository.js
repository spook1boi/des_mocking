import CartsMongoDAO from '../dao/mongo/carts.mongo.js';
import cartDTO from '../dao/DTOs/cart.dto.js';

class CartsRepository {
  constructor() {
    this.cartsDAO = new CartsMongoDAO();
  }

  async getCarts() {
    return await this.cartsDAO.getCarts();
  }

  async addCart(cartDTO) {
    return await this.cartsDAO.addCart(cartDTO);
  }

  async getCartById(cartId) {
    return await this.cartsDAO.getCartById(cartId);
  }

  // Resto de funciones...

  async removeProductFromCart(cartId, prodId) {
    // Implementación similar a la función existente
  }

  // Resto de funciones...

  async getCartWithProducts(cartId) {
    // Implementación similar a la función existente
  }
}

export default CartsRepository;