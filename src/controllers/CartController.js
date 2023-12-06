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

  async removeProductFromCart(cartId, prodId) {
    try {
      await this.cartsRepository.removeProductFromCart(cartId, prodId);
    } catch (error) {
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cartWithProducts = await this.cartsRepository.getCartWithProducts(cartId);
      return cartWithProducts;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productDTO) {
    try {
      await this.cartsRepository.addProductToCart(cartId, productDTO);
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, prodId, quantity) {
    try {
      await this.cartsRepository.updateProductQuantity(cartId, prodId, quantity);
    } catch (error) {
      throw error;
    }
  }

}

export default CartController;