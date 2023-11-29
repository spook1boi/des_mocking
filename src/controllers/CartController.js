import CartsRepository from '../repositories/Carts.repository.js';

class CartController {
  constructor() {
    this.cartsRepository = new CartsRepository();
  }

  async getCarts() {
    try {
      const carts = await this.cartsRepository.getCarts();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async addCart(cartDTO) {
    try {
      await this.cartsRepository.addCart(cartDTO);
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);
      return cart;
    } catch (error) {
      throw error;
    }
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

export default CartController;