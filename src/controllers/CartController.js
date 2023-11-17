import CartManager from '../dao/CartManager.js';

class CartController {
  constructor() {
    this.CartManager = new CartManager();
  }

  async getCarts() {
    try {
      const carts = await this.CartManager.getCarts();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async addCart(cartData) {
    try {
      await this.CartManager.addCart(cartData);
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      const cart = await this.CartManager.getCartById(cid);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductInCart(cartId, prodId) {
    try {
      const result = await this.CartManager.addProductInCart(cartId, prodId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      const result = await this.CartManager.removeProductFromCart(cartId, prodId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateProductsInCart(cartId, newProducts) {
    try {
      const result = await this.CartManager.updateProductsInCart(cartId, newProducts);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateProductInCart(cartId, prodId, updatedProduct) {
    try {
      const result = await this.CartManager.updateProductInCart(cartId, prodId, updatedProduct);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeAllProductsFromCart(cartId) {
    try {
      const result = await this.CartManager.removeAllProductsFromCart(cartId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cart = await this.CartManager.getCartWithProducts(cartId);
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export default CartController;